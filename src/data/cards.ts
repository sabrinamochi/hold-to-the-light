

export interface Card {
  id: number;
  category: Category;
  question: string;
}

export type Category = 'shared memories' | 'their younger years' | 'favourite things';

export const CARDS: Card[] = [
  { id: 1,  category: 'shared memories',     question: 'Tell me about our bus rides together. What were those mornings like?' },
  { id: 2,  category: 'their younger years', question: 'How did you get around when you were young? Where did you like to go?' },
  { id: 3,  category: 'favourite things',    question: "What's a TV show you've always loved — one you could watch over and over?" },
  { id: 4,  category: 'shared memories',     question: 'That trip we took to Japan together — what stood out to you most?' },
  { id: 5,  category: 'their younger years', question: 'Was Grandpa your first love? How did the two of you first meet?' },
  { id: 6,  category: 'favourite things',    question: 'I know how much you love dancing. Do you still listen to music that makes you want to move?' },
  { id: 7,  category: 'their younger years', question: 'What was your favourite thing to do on a free afternoon when you were young?' },
  { id: 8,  category: 'shared memories',     question: "What's the silliest thing a pet ever did in our family? I could use a good story." },
  { id: 9,  category: 'shared memories',     question: 'You used to make that dish for me when I was little. What was the secret that made it so good?' },
  { id: 10, category: 'shared memories',     question: 'What was the day I was born like for you?' },
  { id: 11, category: 'shared memories',     question: 'What was it like the first time you held me?' },
  { id: 12, category: 'favourite things',    question: "What's the best thing you've eaten recently? Did you make it yourself?" },
  { id: 13, category: 'shared memories',     question: 'Tell me a story about when I was really little.' },
  { id: 14, category: 'shared memories',     question: 'Was there something I used to say or do as a child that always made you laugh?' },
  { id: 15, category: 'their younger years', question: 'What was your neighbourhood like when you were a child?' },
  { id: 16, category: 'their younger years', question: 'What was something your mother or father always used to say?' },
  { id: 17, category: 'their younger years', question: 'What did you want to be when you grew up?' },
  { id: 18, category: 'favourite things',    question: 'What time of year do you love most?' },
  { id: 19, category: 'their younger years', question: 'Did you ever go on a date with someone other than Grandpa?' },
  { id: 20, category: 'their younger years', question: 'Where did you and Grandpa like to go on a date?' },
  { id: 21, category: 'shared memories',     question: 'Did I cry a lot when I was little?' },
  { id: 22, category: 'their younger years', question: 'Did you have a best friend growing up? What were they like?' },
  { id: 23, category: 'their younger years', question: 'What\'s the most mischievous thing you and a friend ever did together?' },
  { id: 24, category: 'favourite things',    question: 'If you could have any pet, what would you choose?' },
  { id: 25, category: 'their younger years', question: 'What was your favourite subject in school?' },
  { id: 26, category: 'shared memories',     question: 'What was your favourite moment from my wedding day?' },
];

export const CATEGORY_COLORS: Record<Category, { solid: string; tint: string }> = {
  'shared memories':   { solid: '#faaa88ff', tint: 'rgba(196,133,106,0.25)' },
  'their younger years': { solid: '#84b39eff', tint: 'rgba(122,158,142,0.25)' },
  'favourite things':  { solid: '#ddba78ff', tint: 'rgba(201,169,110,0.25)' },
};

export const FRAME_FILLS: string[] = [
  'radial-gradient(ellipse at 70% 20%, #C4856A 0%, #7a3820 45%, #1a0c04 100%)',
  'radial-gradient(ellipse at 30% 75%, #c49090 0%, #8a6040 50%, #1a1005 100%)',
  'radial-gradient(ellipse at 60% 30%, #d4a850 0%, #8a5820 50%, #100a02 100%)',
  'radial-gradient(ellipse at 40% 60%, #7a9e8e 0%, #3a6050 50%, #050f0a 100%)',
  'radial-gradient(ellipse at 55% 25%, #8eb4c4 0%, #406080 50%, #050c10 100%)',
  'radial-gradient(ellipse at 45% 70%, #a88ec4 0%, #604880 50%, #08050f 100%)',
  'radial-gradient(ellipse at 25% 40%, #c49090 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, #c9a96e 0%, #1a1005 70%)',
  'radial-gradient(ellipse at 70% 30%, #c9a96e 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, #7a9e8e 0%, #050f0a 65%)',
];
