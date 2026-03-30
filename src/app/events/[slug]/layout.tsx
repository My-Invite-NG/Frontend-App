import type { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myinvite.ng";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${apiUrl}/events/${slug}`, { next: { revalidate: 60 } });
    const json = await res.json();
    const event = json?.data;

    if (!event) {
      return {
        title: "Event Not Found",
      };
    }

    const coverImage =
      event.media?.find((m: any) => m.is_cover)?.file_url ||
      event.media?.[0]?.file_url ||
      event.image_url ||
      undefined;

    const description = event.description
      ? event.description.slice(0, 160).replace(/\n/g, " ")
      : "Check out this event on MyInvite!";

    return {
      title: event.title,
      description,
      openGraph: {
        title: event.title,
        description,
        url: `${siteUrl}/events/${slug}`,
        type: "website",
        images: coverImage
          ? [
              {
                url: coverImage,
                width: 1200,
                height: 630,
                alt: event.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description,
        images: coverImage ? [coverImage] : undefined,
      },
    };
  } catch (error) {
    return {
      title: "Event",
    };
  }
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
