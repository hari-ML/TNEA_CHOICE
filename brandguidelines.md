Step 1: Requirement Analysis
We defined core features:

Cutoff-based college prediction
Additional columns: NIRF ranking, cutoff change, placement packages
Mobile and desktop compatibility
User registration system with data storage

Step 2: Data Collection
We implemented web scraping to gather:

Engineering colleges across Tamil Nadu
District-wise classification
Historical cutoff data
Placement and ranking information

This is done using backend scripts, ensuring structured and clean datasets.

Step 3: Backend Design
We created APIs to:

Process user cutoff input
Filter and rank colleges
Serve optimized data responses

To maintain performance below 50 ms:

Data is preprocessed and cached
APIs are lightweight and stateless

Step 4: Frontend Development
Using Antigravity:

Designed responsive UI similar to the reference platform
Added filters (category, district, branch)
Integrated additional columns:
NIRF ranking
Cutoff increase
Placement data

Step 5: Additional Features

Added a redirect button linking to official college websites
Implemented a floating popup:
“1-on-1 session coming soon”
Registration form with input validation

Step 6: Data Storage

User form data is connected to Google Drive using API integration
Ensured structured storage (Google Sheets format)

Step 7: Deployment

Hosted on Vercel
Enabled global CDN for faster load times
Optimized assets for mobile and desktop performance

Step 8: Testing and Optimization

Tested across devices and browsers
Ensured low latency responses
Validated accuracy of prediction results

Conclusion:
The system is designed to be scalable, fast, and user-centric, combining real-time data with predictive analytics to assist students effectively.