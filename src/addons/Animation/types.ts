export type TKeyframesDictionary<TKeys extends string> = {
  [K in TKeys]: {
    readonly firstGID: number;
    readonly lastGID: number;
  };
};
