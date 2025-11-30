# Deployment Guide

This guide provides instructions for deploying the Ajaypreet Singh resume website to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Free)

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or `genspark_ai_developer`)
   - Folder: `/ (root)`
   - Click Save

2. **Your site will be available at:**
   ```
   https://ajay3455.github.io/test/
   ```

3. **Custom domain (optional):**
   - Add a `CNAME` file with your domain
   - Configure DNS settings

### Option 2: Netlify (Free)

1. **Via Git:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `/`
   - Click "Deploy site"

2. **Via Drag & Drop:**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag and drop your project folder
   - Instant deployment!

3. **Custom domain:**
   - Go to Domain settings
   - Add custom domain

### Option 3: Vercel (Free)

1. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

2. **Configuration:**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `/`

### Option 4: Cloudflare Pages (Free)

1. **Setup:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create a project"
   - Connect GitHub account
   - Select repository

2. **Build settings:**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`

### Option 5: Traditional Web Hosting

1. **Upload via FTP/SFTP:**
   - Use FileZilla, WinSCP, or similar
   - Upload all files to `public_html` or `www` directory
   - Ensure `index.html` is in the root

2. **Files to upload:**
   ```
   index.html
   styles.css
   script.js
   resume.pdf
   ```

## 📋 Pre-Deployment Checklist

- [ ] Test website locally
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Update contact information if needed
- [ ] Test resume PDF download
- [ ] Verify social media links
- [ ] Check all images/icons load
- [ ] Test on multiple browsers

## 🔧 Configuration Steps

### Update Links
Before deploying, update these in `index.html`:

1. **LinkedIn URL** (line ~36):
   ```html
   <a href="https://www.linkedin.com/in/ajaypreet-singh" target="_blank">
   ```
   Update with actual LinkedIn profile URL

2. **Email** (line ~34):
   ```html
   <a href="mailto:ajaypreetwork@gmail.com">
   ```
   Confirm email address is correct

### SEO Optimization (Optional)

Add to `<head>` section in `index.html`:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="Ajaypreet Singh - Security Supervisor & Operations Leader with 4+ years experience. View professional resume, certifications, and experience.">
<meta name="keywords" content="Security Supervisor, Operations Leader, Toronto, Security Professional, Ajaypreet Singh">
<meta name="author" content="Ajaypreet Singh">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-domain.com/">
<meta property="og:title" content="Ajaypreet Singh | Security Supervisor & Operations Leader">
<meta property="og:description" content="Professional resume and portfolio of Ajaypreet Singh">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://your-domain.com/">
<meta property="twitter:title" content="Ajaypreet Singh | Security Supervisor & Operations Leader">
<meta property="twitter:description" content="Professional resume and portfolio of Ajaypreet Singh">
```

### Google Analytics (Optional)

Add before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Best Practices

1. **HTTPS Only:**
   - Most modern hosting platforms provide free SSL
   - Ensure your site is served over HTTPS

2. **Remove Sensitive Information:**
   - Don't include full addresses
   - Consider using a contact form instead of direct email

3. **Regular Updates:**
   - Keep certifications dates current
   - Update experience timeline
   - Review and update content quarterly

## 📱 Mobile Testing

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

Use these tools:
- Browser DevTools responsive mode
- [BrowserStack](https://www.browserstack.com/) (paid)
- [LambdaTest](https://www.lambdatest.com/) (free tier)

## ⚡ Performance Optimization

### 1. Minify CSS and JavaScript

Install minifier:
```bash
npm install -g minifier
```

Minify files:
```bash
minify styles.css > styles.min.css
minify script.js > script.min.js
```

Update HTML to use minified versions:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

### 2. Optimize Images

If you add images later:
- Use WebP format when possible
- Compress images (TinyPNG, Squoosh)
- Use appropriate dimensions
- Implement lazy loading

### 3. Enable Caching

Create `.htaccess` file (for Apache servers):
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>
```

## 🌐 Domain Setup

### Register a Domain
Recommended registrars:
- Namecheap
- Google Domains
- Cloudflare Registrar
- GoDaddy

### DNS Configuration

Point your domain to hosting:

**For GitHub Pages:**
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
```

**For Netlify/Vercel/Cloudflare:**
- Follow platform-specific DNS instructions
- Usually just update nameservers

## 📊 Monitoring

### Google Search Console
1. Add property: `https://your-domain.com`
2. Verify ownership
3. Submit sitemap (create one if needed)

### Uptime Monitoring
Free services:
- [UptimeRobot](https://uptimerobot.com/)
- [StatusCake](https://www.statuscake.com/)
- [Pingdom](https://www.pingdom.com/)

## 🆘 Troubleshooting

### Site not loading:
- Check DNS propagation (can take 24-48 hours)
- Verify index.html is in root directory
- Check browser console for errors

### Styling broken:
- Verify CSS file path is correct
- Check for CSS syntax errors
- Clear browser cache

### JavaScript not working:
- Check browser console for errors
- Verify script.js file path
- Ensure Font Awesome CDN is loading

## 📞 Support

For deployment issues:
- Check hosting platform documentation
- Review error logs
- Contact platform support

For website bugs:
- Check browser console
- Test in different browsers
- Review JavaScript errors

## 🎉 Post-Deployment

After successful deployment:
- [ ] Test all links and buttons
- [ ] Verify PDF download works
- [ ] Check contact forms/emails
- [ ] Test on mobile devices
- [ ] Share URL with contacts
- [ ] Add to LinkedIn profile
- [ ] Add to email signature
- [ ] Submit to search engines

---

**Need help?** Contact: ajaypreetwork@gmail.com

**Last Updated:** November 30, 2025
