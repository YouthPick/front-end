import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/shared/constants';

interface UseSeoOptions {
  /** 페이지 고유 제목. 최종 title은 `{title} | ${SITE_NAME}` 형태로 조합된다. */
  title: string;
  description?: string;
  /** 검색엔진 색인에서 제외해야 하는 페이지(로그인 필요 화면, 로그인/콜백 등)면 true. */
  noindex?: boolean;
  image?: string;
}

function upsertMetaTag(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

// 이 앱은 SSR 없이 CSR로만 동작하는 SPA라 route 전환 시 <head>를 이 hook이 직접 갱신한다.
// 검색엔진 노출이 필요 없는 화면(로그인 필요 페이지 등)은 noindex를 true로 넘긴다.
export function useSeo({ title, description, noindex = false, image }: UseSeoOptions): void {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    upsertMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (description) {
      upsertMetaTag('name', 'description', description);
      upsertMetaTag('property', 'og:description', description);
    }

    const canonicalUrl = `${SITE_URL}${location.pathname}`;
    upsertCanonicalLink(canonicalUrl);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:image', image ?? DEFAULT_OG_IMAGE);
  }, [title, description, noindex, image, location.pathname]);
}
