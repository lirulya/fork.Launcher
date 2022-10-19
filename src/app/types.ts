export type CarouselItem = {
  id: number;
  title: string;
  image: string;
  link: string;
};

export type Manifest = {
  gameVersion: string;
  carousel: Array<CarouselItem>;
};
