// Replace these demo URLs with your owned Cloudinary delivery URLs before launch.
export const media = {
  homeVideo: 'https://res.cloudinary.com/demo/video/upload/q_auto/dog.mp4',
  workVideo: 'https://res.cloudinary.com/demo/video/upload/q_auto/dog.mp4',
  poster:
    'https://res.cloudinary.com/demo/video/upload/so_0,w_1600,q_auto/dog.jpg',
};
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;
const sea = photo('photo-1518837695005-2083093ee35b');
const mountain = photo('photo-1464822759023-fed622ff2c3b');
const desert = photo('photo-1509316785289-025f5b846b35');
const forest = photo('photo-1441974231531-c6227db76b6e');
export const tags = [
  'ALL',
  'VIDEO',
  'BRANDING',
  'ART DIRECTION',
  'PHOTO',
  'GRAPHIC DESIGN',
];
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  images: string[];
  description: string;
};

export const projects: Project[] = [
  {
    slug: 'between-tides',
    title: 'BETWEEN TIDES',
    subtitle: '바다와 빛 사이',
    date: '2026.01',
    tags: ['VIDEO', 'ART DIRECTION'],
    images: [sea, mountain, sea, forest],
    description:
      '빛과 움직임의 관계를 탐색하는 포트폴리오 샘플입니다. 실제 프로젝트 설명과 크레딧으로 교체할 수 있습니다.',
  },
  {
    slug: 'still-moving',
    title: 'STILL MOVING',
    subtitle: '멈춘 순간, 계속되는 움직임',
    date: '2026.01',
    tags: ['PHOTO', 'ART DIRECTION'],
    images: [mountain, forest, desert, sea],
    description:
      '풍경의 리듬을 담은 포트폴리오 샘플입니다. 현재 사진과 텍스트는 화면 구성을 위한 더미 콘텐츠입니다.',
  },
  {
    slug: 'other-side',
    title: 'THE OTHER SIDE',
    subtitle: '익숙한 풍경의 다른 면',
    date: '2025.12',
    tags: ['BRANDING', 'GRAPHIC DESIGN'],
    images: [desert, sea, forest, mountain],
    description:
      '새로운 시선을 위한 포트폴리오 샘플입니다. 실제 브랜드 작업 이미지와 소개로 교체할 수 있습니다.',
  },
];
