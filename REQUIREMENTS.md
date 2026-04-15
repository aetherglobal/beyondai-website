# Beyond AI Website

## Website Requirements Document

**Project:** Beyond AI Initiative Website  
**Old Website:** https://www.beyondai.africa  
**Architecture:** Next.js frontend with Payload as headless CMS  
**Integrations:** Luma (events), Mailchimp (newsletter)

---

## 1. Purpose of the Website

The Beyond AI website is the central public platform for the initiative.

It should allow people to:

- Understand what the Beyond AI initiative is
- See upcoming events and register
- Stay informed through the newsletter
- Explore articles and resources
- Learn about the Nyansa Futures conference
- Partner or sponsor the initiative
- Volunteer and participate in the movement

Beyond AI is designed as an ongoing civic platform, not just a single event series. The website must reflect this ongoing engagement.

---

## 2. Primary User Actions

Every page should help users complete one or more of these actions:

- Register for a Beyond AI event
- Join the newsletter
- Learn about the initiative
- Read articles or updates
- Attend the Nyansa Futures conference
- Become a sponsor or partner
- Volunteer with the initiative
- Contact the team

---

## 3. Technology Architecture

### Frontend

- Next.js

### Content Management

- Payload (headless CMS)

### Hosting

- Recommended: Vercel (or equivalent modern hosting)

### Event System

- Luma integration

### Newsletter System

- Mailchimp integration

### Benefits

- Fast page loading
- SEO optimization
- Flexible content publishing
- Easy updates by non-technical team members

---

## 4. Core Pages

### 4.1 Homepage

**Purpose:**  
Provide a clear overview of the initiative and highlight the next upcoming activity.

**Sections:**

- **Hero Section**
  - Title introducing Beyond AI
  - Short description
  - Button: Register for next event
  - Button: Join newsletter

- **Next Event Section**
  - Title of event
  - Date
  - Location
  - Short description
  - Register button (Luma)

- **What is Beyond AI**
  - 3–4 lines explaining the initiative

- **Programs Overview**
  - AI Watch — Monthly forums
  - AI Pulse — Newsletter and knowledge platform
  - Beyond the Algorithm — Storytelling and media
  - Nyansa Futures — Annual conference

- **Latest Articles**
  - Recent articles or insights

- **Nyansa Futures Highlight**
  - Short explanation of the conference
  - Link to conference page

- **Sponsors / Partners**
  - Logo display

- **Newsletter Signup**
  - Mailchimp form

- **Footer**
  - Navigation links
  - Contact information
  - Social media links

---

### 4.2 About Page

**Purpose:**  
Explain what the initiative is and why it exists.

**Sections:**

- What Beyond AI is
- Why the initiative exists
- Vision and mission
- Strategic objectives
- Programs and activities
- Organizations behind the initiative
  - Aether Strategies
  - Bilili Creative Lab

---

### 4.3 Events Page

**Purpose:**  
List upcoming and past Beyond AI events.

**Sections:**

- **Upcoming Events**
  - Event title
  - Date
  - Location
  - Short description
  - Register button

- **Past Events Archive**
  - List of previous events
  - Link to event details

---

### 4.4 Event Detail Page

Each event page should include:

- Event title
- Date and time
- Location
- Event description
- Speaker list (optional)
- Agenda (optional)
- Registration button (Luma integration)
- Partner logos (if relevant)

---

## 5. Luma Integration (Event Registration)

Users must register for events through Luma.com.

**Options:**

- Option A: Embed Luma registration module
- Option B: Link to Luma event page

**Key Requirements:**

- Registration button clearly visible
- Simple user flow
- No duplicate forms on the website

---

## 6. Nyansa Futures Conference Page

This page explains the annual flagship conference.

**Content:**

- What Nyansa Futures is
- Why it matters
- Who should attend
- Conference format (two-day hybrid conference)
- Key themes
- Expected outcomes

**CTAs:**

- Attend button
- Sponsor button

**Additional:**

- FAQ section

Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation.

---

## 7. Articles / Insights Section

**Purpose:**  
Publish thought leadership and updates.

**Content Types:**

- Commentary
- Explainers
- Event summaries
- Research insights
- Policy discussions

**Features:**

- Article listing page
- Article detail pages
- Categories or tags
- Featured images
- Easy publishing via CMS

---

## 8. Sponsors and Partners Page

**Purpose:**  
Recognize supporters and attract new sponsors.

**Sections:**

- Current sponsors
- Knowledge partners
- Community partners

Logos should be displayed clearly.

Include CTA linking to the **Become a Sponsor** page.

---

## 9. Become a Sponsor Page

**Purpose:**  
Encourage organizations to support the initiative.

**Content:**

- Why sponsorship matters
- Audience reach
- Benefits for sponsors

**Includes:**

- Contact form
- Email contact

---

## 10. Volunteer Page

**Purpose:**  
Allow individuals to contribute.

**Content:**

- What volunteering involves
- Types of roles

**Examples:**

- Event support
- Research and writing
- Media and communications
- Community outreach
- Logistics

**Volunteer Form Fields:**

- Name
- Email
- Phone
- City
- Country
- Areas of interest
- Short message

Submissions should be sent to the Beyond AI email inbox.

---

## 11. Contact Page

**Includes:**

- Email address
- Phone number
- Contact form
- Social media links

---

## 12. Newsletter Integration (Mailchimp)

Users should be able to subscribe to the AI Pulse newsletter.

**Fields:**

- Name
- Email
- Phone
- City
- Country

**Requirements:**

- Direct Mailchimp API integration
- Automatic storage in Mailchimp list
- No manual export

**Placement:**

- Homepage
- Footer
- Optional popup

---

## 13. Content Management Requirements

Payload CMS must allow administrators to:

- Publish articles
- Update homepage sections
- Add/edit events
- Add sponsors
- Update conference information
- Manage images and media

Editors should not require developer assistance.

---

## 14. Design Requirements

The visual design should feel:

- Modern
- Credible
- Content-focused
- Accessible

**Avoid:**

- Cliché AI imagery
- Robotic graphics
- Overly technical aesthetics

**Use:**

- Real people
- Discussions
- Community engagement
- African context

---

## 15. Responsiveness

The site must work well on:

- Mobile phones
- Tablets
- Desktops

**Mobile priorities:**

- Event registration
- Reading articles
- Newsletter signup

---

## 16. Performance

**Requirements:**

- Optimized images
- Efficient API calls
- Minimal heavy scripts
- Fast hosting

---

## 17. Accessibility

Follow best practices:

- Readable text contrast
- Clear headings
- Alt text for images
- Accessible forms

---

## 18. Security

**Practices:**

- Secure CMS configuration
- Limited plugins
- Spam protection on forms
- Regular updates

---

## 19. Sitemap

**Main Navigation:**

- Home
- About
- Events
- Nyansa Futures
- Articles
- Sponsors
- Volunteer
- Contact

---

## 20. Success Criteria

The website is successful if:

- Visitors clearly understand the initiative
- Event registrations increase
- Newsletter subscriptions grow
- Sponsors and partners reach out
- Volunteers sign up
- Team can easily update content
