import React, { ComponentProps, useCallback, useEffect, useReducer } from 'react';
import { DropzoneOptions, DropzoneState, useDropzone } from 'react-dropzone';
import firebase from 'firebase/app';
import 'firebase/storage';
import styled from 'styled-components';
import { Article, articleCollection } from '~/external_packages/firestore_schema';
import { appendTimestamp, withUpdateStateReducer } from '~/libs';

type InputProps = JSX.IntrinsicElements['input'];
type TextAreaProps = JSX.IntrinsicElements['textarea'];

const UiComponent: React.FCX<{
  title: InputProps;
  body: TextAreaProps;
  tags: InputProps[];
  previewUrl?: string;
  onAddTagClick: () => void;
  onSubmitClick: () => void;
  dropZoneState: DropzoneState;
  onPreviewRemoveClick?: () => void;
}> = (props) => (
  <div className={props.className}>
    <label>image</label>
    {props.previewUrl ? (
      <>
        <img src={props.previewUrl} className="preview" alt="" />
        <button onClick={props.onPreviewRemoveClick}>削除</button>
      </>
    ) : (
      <div {...props.dropZoneState.getRootProps()} className={'upload'}>
        <input {...props.dropZoneState.getInputProps()} />
        <p>ファイルをアップロード</p>
      </div>
    )}
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

const StyledUiComponent = styled(UiComponent)`
  & {
    width: 100%;
  }

  .preview {
    max-width: 100%;
    display: block;
  }

  .upload {
    p {
      text-align: center;
      border: 2px dotted #ccc;
      padding: 40px;
    }
  }
`;

const Container = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles: File[]) => {
      dispatch({ type: 'addImage', value: acceptedFiles[0] });
    },
    [dispatch]
  );

  const dropZoneState = useDropzone({ accept: 'image/*', onDrop });

  useEffect(() => {
    if (!state._isSubmit) {
      return;
    }

    (async () => {
      try {
        // TODO: name が重複していると上書きされてしまうのでユニークな値を生成できる何かを使う
        const imagePath = await (async () => {
          if (!state.image) {
            return undefined;
          }

          const imagePath = `images/${state.image.name}`;
          const storageRef = firebase.storage().ref().child(imagePath);
          await storageRef.put(state.image);

          return imagePath;
        })();

        const data: Article = appendTimestamp({
          title: state.title,
          body: state.body,
          tags: state.tags,
          image_path: imagePath,
        });

        firebase
          .firestore()
          .collection(articleCollection)
          .add(data)
          .then((value) => {
            dispatch({ type: 'resetState' });
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [state, dispatch]);

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
    dropZoneState,
    previewUrl: state?.previewUrl,
    onPreviewRemoveClick: () => dispatch({ type: 'clearImage' }),
  };

  return <StyledUiComponent {...innerProps} />;
};

type State = {
  title: string;
  body: string;
  tags: string[];
  image?: File;
  previewUrl?: string;
  _isSubmit: boolean;
};

type Actions =
  | { type: 'updateTag'; value: { idx: number; data: string } }
  | { type: 'addTag' }
  | { type: 'addImage'; value: File }
  | { type: 'clearImage' }
  | { type: 'resetState' };

const initialState: State = {
  title: '',
  body: '',
  tags: [],
  image: undefined,
  previewUrl: undefined,
  _isSubmit: false,
};

const reducer = withUpdateStateReducer<State, Actions>((state, action) => {
  if (action.type === 'updateTag') {
    const tags: string[] = Object.assign([], state.tags, { [action.value.idx]: action.value.data });
    return { ...state, tags };
  }

  if (action.type === 'addTag') {
    return { ...state, tags: state.tags.concat('') };
  }

  if (action.type === 'addImage') {
    return { ...state, image: action.value, previewUrl: URL.createObjectURL(action.value) };
  }

  if (action.type === 'clearImage') {
    // 状態をクリアする前に revokeObjectURLしてメモリリーク対策をする
    state.previewUrl && URL.revokeObjectURL(state.previewUrl);
    return { ...state, image: undefined, previewUrl: undefined };
  }

  if (action.type === 'resetState') {
    // 状態をクリアする前に revokeObjectURLしてメモリリーク対策をする
    state.previewUrl && URL.revokeObjectURL(state.previewUrl);
    return initialState;
  }

  return state;
});

export default Container;
