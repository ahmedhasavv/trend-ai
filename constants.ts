import { Trend, TrendCategory } from './types';

export const TRENDS: Trend[] = [
  {
    id: '90s-film-aesthetic',
    name: '90s Film Aesthetic',
    description: 'Capture the essence of a 90s film with a retro, grainy look, romantic atmosphere, and vintage fashion.',
    prompt: 'Create a retro, vintage-inspired, grainy yet bright image with small sunbeams based on the reference image. Keep the exact same face and hairstyle of the reference person. The man should wear a lightweight garnet shirt, combined with white pants plated in a Pinterest-inspired aesthetic. The atmosphere must capture the essence of a 90s film, in a windy and romantic atmosphere. Standing in the aesthetic street light and reading books while a few leaves blow into the air with dramatic contrasts.',
    exampleImage: 'https://picsum.photos/seed/90sfilm/500/500',
    category: TrendCategory.ART,
  },
  {
    id: 'lemon-green-fashion',
    name: 'Futuristic Green Outfit',
    description: 'Style yourself in a futuristic fashion editorial with a lemon-green combat jean and oversized sweatshirt.',
    prompt: 'A male model, with the exact same face & hairstyle as the uploaded photo, not changing the facial expression. The model is wearing an oversized white sweatshirt, lemon green oversized combat jeans, styled with lemon green neutral or nike sneakers and white ribbed socks. Environment: muted lemon green-toned studio background. Lighting: soft cinematic glow highlighting skin and fabric textures. Style: fashion editorial and futuristic. Composition: model seated elegantly with relaxed posture.',
    exampleImage: 'https://picsum.photos/seed/lemongreen/500/500',
    category: TrendCategory.FASHION,
  },
  {
    id: 'cinematic-shadow-portrait',
    name: 'Cinematic Shadow Portrait',
    description: 'Create a dramatic, high-resolution cinematic portrait with strong shadows from Venetian blinds.',
    prompt: 'A high-resolution 8K cinematic image of the man in the uploaded image, sitting on a wooden chair with his arms crossed on the chair\'s back. He is wearing an oversized white T-shirt, black pants, an Apple Watch, and stylish sunglasses. A strong spotlight filters through the Venetian blinds, casting dramatic shadows on his face, body, and the background wall. The composition is simple, with a dark, neutral background and geometric lighting patterns. His expression is both confident and calm, giving the image an elegant cinematic feel. Important: The face and hairstyle must match exactly the reference image provided. Maintain the same texture and length of the hairstyle, and the same facial proportions. The lighting should mimic the effect of the striped shadow cast by the blinds on his face and body. The person must remain seated on the wooden chair with their arms crossed, not standing.',
    exampleImage: 'https://picsum.photos/seed/cinematicshadow/500/500',
    category: TrendCategory.CHARACTERS,
  },
  {
    id: 'polaroid-flash-photo',
    name: 'Polaroid Flash Photo',
    description: 'A candid, slightly blurry Polaroid-style photo with a flash effect and a simple white curtain background.',
    prompt: 'Recreate the uploaded image as if it were a photo taken with a Polaroid camera. The final image should have a slight blur and a harsh, direct flash effect as if taken in a dark room. Do not change the faces or poses of the people in the image. Replace the original background with simple white curtains. The subjects should be looking towards the camera.',
    exampleImage: 'https://picsum.photos/seed/polaroidhug/500/500',
    category: TrendCategory.ART,
  },
];