import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JBM',
    short_name: 'JBM',
    description: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060B13',
    theme_color: '#D97706',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
