import Header from './components/Header';
import Feed from './components/Feed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Feed />
    </div>
  );
}
