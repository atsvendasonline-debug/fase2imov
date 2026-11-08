import { Helmet } from "react-helmet-async";

const SITE = "ImovLocal";
const DEFAULT_TITLE = "ImovLocal — encontre imóveis perto de você, sem complicação";
const DEFAULT_DESC = "Feed social de imóveis para comprar ou alugar em várias cidades brasileiras. Fale direto com quem anuncia pelo WhatsApp.";

export const Seo = ({ title = DEFAULT_TITLE, description = DEFAULT_DESC, url, image }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {url && <meta property="og:url" content={url} />}
    {image && <meta property="og:image" content={image} />}
    <meta property="og:locale" content="pt_BR" />
    <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}
  </Helmet>
);
