export type GuideCategory = "기초" | "전략" | "기술" | "용어";

export type F1GuideEntry = {
  id: string;
  category: GuideCategory;
  term: string;
  shortDesc: string;
  fullDesc: string;
};
