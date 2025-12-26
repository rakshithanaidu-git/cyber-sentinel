import { URLAnalyzer } from "@/components/URLAnalyzer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PhishGuard - URL Phishing Detection Tool</title>
        <meta name="description" content="Analyze URLs for phishing indicators. Detect suspicious patterns, brand impersonation, and security threats in real-time." />
      </Helmet>
      <URLAnalyzer />
    </>
  );
};

export default Index;
