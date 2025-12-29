type Environment = 'prod' | 'test' | 'dev';

function detectEnvironment(): Environment {
  const hostname = window.location.hostname;
  
  if (hostname.includes('dev.') || hostname.includes('localhost') || hostname.includes('lovableproject.com')) {
    return 'dev';
  }
  
  if (hostname.includes('test.') || hostname.includes('staging.')) {
    return 'test';
  }
  
  return 'prod';
}

export function setFaviconByEnvironment(): void {
  const env = detectEnvironment();
  const faviconPath = `/favicon-${env}.svg`;
  
  // Remove existing favicon links
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(link => link.remove());
  
  // Create new favicon link
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = faviconPath;
  document.head.appendChild(link);
}
