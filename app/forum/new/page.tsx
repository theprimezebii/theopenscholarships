import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewDiscussionForm from './NewDiscussionForm';

export const metadata = {
  title: 'Start New Discussion | TheOpenScholarships Forum',
  description: 'Start a new discussion in the TheOpenScholarships student forum. Ask questions, share experiences, and get advice from fellow scholarship seekers.',
  keywords: 'start discussion, forum post, scholarship questions, study abroad forum',
};

export default function NewDiscussionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NewDiscussionForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
