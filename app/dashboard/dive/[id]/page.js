import DiveDetails from './DiveDetails';

// This is a Server Component
export default function DivePage({ params }) {
  return <DiveDetails id={params.id} />;
}