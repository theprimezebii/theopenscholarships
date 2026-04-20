'use client';

export default function BlogContent({ content }: { content: string }) {
  return (
    <article className="blog-content">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
