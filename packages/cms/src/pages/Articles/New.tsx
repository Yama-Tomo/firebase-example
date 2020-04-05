import React, { ComponentProps, useEffect, useReducer } from 'react';
import firebase from 'firebase/app';
import { Article, articleCollection } from '~/firestore_schema';
import { appendTimestamp, withUpdateStateReducer } from '~/libs';

type InputProps = JSX.IntrinsicElements['input'];
type TextAreaProps = JSX.IntrinsicElements['textarea'];

const UiComponent: React.FCX<{
  title: InputProps;
  body: TextAreaProps;
  tags: InputProps[];
  onAddTagClick: () => void;
  onSubmitClick: () => void;
}> = (props) => (
  <div>
    <div>
      <label>title</label>
      <input type="text" {...props.title} />
    </div>
    <div>
      <label>body</label>
      <textarea {...props.body} />
    </div>
    <div>
      <label>
        tags <span onClick={props.onAddTagClick}>+add</span>
      </label>
      <ul>
        {props.tags.map((tag, i) => (
          <li key={i}>
            <input type="text" {...tag} />
          </li>
        ))}
      </ul>
    </div>
    <button onClick={props.onSubmitClick}>登録</button>
  </div>
);

const Container = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state._isSubmit) {
      return;
    }

    const { _isSubmit, ...rest } = state;
    const data: Article = appendTimestamp(rest);

    firebase
      .firestore()
      .collection(articleCollection)
      .add(data)
      .then((value) => {
        dispatch({ type: 'update', value: initialState });
      });
  }, [state]);

  const tagChangeCreator = (idx: number): InputProps['onChange'] => (e) => {
    dispatch({ type: 'updateTag', value: { idx, data: e.target.value } });
  };

  const innerProps: ComponentProps<typeof UiComponent> = {
    title: {
      onChange: (e) => dispatch({ type: 'update', value: { title: e.target.value } }),
      value: state.title,
    },
    body: {
      onChange: (e) => dispatch({ type: 'update', value: { body: e.target.value } }),
      value: state.body,
    },
    tags: !state.tags.length
      ? [{ onChange: tagChangeCreator(0), value: '' }]
      : state.tags.map((tag, idx) => ({ onChange: tagChangeCreator(idx), value: tag })),
    onSubmitClick() {
      dispatch({ type: 'update', value: { _isSubmit: true } });
    },
    onAddTagClick() {
      dispatch({ type: 'addTag' });
    },
  };

  return <UiComponent {...innerProps} />;
};

type State = { title: string; body: string; tags: string[]; _isSubmit: boolean };
type Actions = { type: 'updateTag'; value: { idx: number; data: string } } | { type: 'addTag' };

const initialState: State = { title: '', body: '', tags: [], _isSubmit: false };

const reducer = withUpdateStateReducer<State, Actions>((state, action) => {
  if (action.type === 'updateTag') {
    const tags: string[] = Object.assign([], state.tags, { [action.value.idx]: action.value.data });
    return { ...state, tags };
  }

  if (action.type === 'addTag') {
    return { ...state, tags: state.tags.concat('') };
  }

  return state;
});

export default Container;
