import { siteMetadata } from '../metadata'
import { Metadata } from 'next'

interface GenerateMetadataProps {
    title?: string
    description?: string
    image?: string
    noIndex?: boolean
    pathname?: string
}

export function generateMetadata({
    title,
    description,
    image = '/og-image.jpeg',
    noIndex = false,
    pathname = '',
}: GenerateMetadataProps): Metadata {
    const metaTitle = title
        ? `${title} | ${siteMetadata.company.name}`
        : siteMetadata.title
    const metaDescription = description || siteMetadata.description
    const url = `${siteMetadata.siteUrl}${pathname}`

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: siteMetadata.keywords,
        authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
        metadataBase: new URL(siteMetadata.siteUrl),
        alternates: {
            canonical: url,
            languages: siteMetadata.alternateLanguages,
        },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url,
            siteName: siteMetadata.openGraph.siteName,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
            locale: siteMetadata.openGraph.locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            site: siteMetadata.twitter.site,
            creator: siteMetadata.twitter.handle,
            images: [image],
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

    }
} 