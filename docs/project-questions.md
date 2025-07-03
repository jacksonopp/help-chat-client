# Frontend Project Requirements Questions

Please answer these questions to help create a comprehensive frontend specification for the Help Desk Portal application.

## 1. UI Framework & Design System

- Do you want to use a specific UI component library (like Angular Material, PrimeNG, or Ng-Zorro)?
    - PrimeNG with Tailwind v4
- Do you have a preferred design system or brand guidelines to follow?
    - Tailwind v4
- Should the UI be modern/minimalist or more traditional enterprise-style?
    - Modern

## 2. State Management

- Do you prefer NgRx for complex state management, or would you like to use Angular's built-in services with signals?
    - Use angulars built-in services
- Should we implement real-time state updates for ticket changes via WebSocket?
    - Not yet

## 3. Authentication & Security

- Do you want to implement SSO (Single Sign-On) integration?
    - Not yet, we are using JWT on the backend. Eventually we will integrate it
- Should we support multi-factor authentication on the frontend?
    - Not yet
- Do you need role-based UI components (showing/hiding features based on user role)?
    - Yes

## 4. Real-time Features

- Should ticket updates be real-time (WebSocket) or polling-based?
    - Polling based
- Do you want live chat functionality between agents and users?
    - Yes
- Should notifications be push notifications or in-app only?
    - this is a web app, so in-app only

## 5. File Handling

- Do you want drag-and-drop file upload for ticket attachments?
    - This will be handled with the PrimeNG fileupload component
- Should we implement file preview (images, PDFs) in the browser?
    - Yes
- Do you need file upload progress indicators?
    - No

## 6. Mobile Responsiveness

- Should this be a responsive web app or do you need a separate mobile app?
    - This should be a responsive web app
- Do you need offline capabilities for mobile users?
    - No

## 7. Internationalization

- Do you need multi-language support?
    - No
- Any specific languages to support initially?
    - Engilsh only

## 8. Analytics & Monitoring

- Do you want to integrate analytics tools (Google Analytics, etc.)?
    - Not yet
- Should we implement error tracking and performance monitoring?
    - Not yet

## 9. Deployment & CI/CD

- Do you have a preferred hosting platform (Azure, AWS, etc.)?
    - The idea is that this is a self-hostable platform. Eventually we will provide a hosted solution
- Should we set up automated testing and deployment pipelines?
    - Not yet

## 10. Additional Features

- Do you need a dashboard with charts and analytics?
    - Yes
- Should we implement search functionality with filters?
    - Yes
- Do you want email templates for notifications?
    - We will handle that via the backend
- Any specific accessibility requirements (WCAG compliance)?
    - Ideally we have wgag compliance

---

**Instructions:** Please provide your answers below each question. You can add additional requirements or clarifications as needed. 