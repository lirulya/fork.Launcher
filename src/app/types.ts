export type CarouselItem = {
  id: number;
  title: string;
  image: string;
  link: string;
};

export type Manifest = {
  launcherVersion: string;
  gameVersion: string;
  carousel: Array<CarouselItem>;
};

export enum DebugMode {
  NO_DEBUG,
  JMX,
  AGENT,
  AGENT_SUSPENDED,
  __LENGTH
}