// データを読み出す時にだけ取得できるプロパティを表現する型
export type WithReadProps<FLAG> = FLAG extends true
  ? {
      id: string;
    }
  : {};
