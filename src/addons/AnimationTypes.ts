interface IKeyframes {
  readonly firstGID: number;
  readonly lastGID: number;
}

export type IKeyframesDictionary<TKeys extends string> = {
  [K in TKeys]: IKeyframes;
};
