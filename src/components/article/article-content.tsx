import { memo } from "react";

export const ArticleContent = memo(function ArticleContent({
  title,
  author,
  pubDate,
  content,
}: {
  title: string;
  author?: string;
  pubDate?: string;
  content: string;
}) {
  return (
    <div className="max-w-prose mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        {author && <p className="text-sm text-muted-foreground">By {author}</p>}
        {pubDate && (
          <p className="text-sm text-muted-foreground">
            {new Date(pubDate).toLocaleDateString()}
          </p>
        )}
      </header>

      {content && (
        <article
          className="prose prose-lg dark:prose-invert 
          prose-a:text-primary 
          prose-img:rounded-md 
          prose-img:mx-auto 
          prose-img:block 
          prose-img:max-w-full 
          prose-img:h-auto 
          prose-img:!transform-none 
          prose-img:!object-contain 
          prose-img:!object-center
          prose-figure:!my-8
          prose-figcaption:text-sm
          prose-figcaption:mt-2
          [&_ul]:space-y-2
          [&_ul_li]:flex
          [&_ul_li]:items-center
          [&_ul_li]:gap-2
          [&_ul_li]:my-0
          [&_ul_li_img]:my-0
          [&_ul_li_img]:inline-block
          [&_ul_li_span]:inline-flex
          [&_ul_li_span]:items-center
          reader-content
          prose-svg:!max-h-6
          prose-svg:!max-w-24
          prose-use:!max-h-6
          prose-use:!max-w-6
          [&_span_svg]:!w-6
          [&_span_svg]:!h-6
          [&_svg[fill='none']]:hidden"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      )}
    </div>
  );
});
