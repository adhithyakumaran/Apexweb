export type Testimonial = {
  company: string;
  contact: string;
  quote: string;
};

// PLACEHOLDER COPY — these are NOT real quotes.
// Client has given permission to use each contact's name/company, but has not
// yet supplied their actual words. Replace `quote` below with what each
// person actually said before this goes live — do not publish as-is.
export const testimonials: Testimonial[] = [
  {
    company: "Prowess IQ",
    contact: "Balamurugan Natarajan",
    quote: "The testing agent helped us reduce repetitive QA work and gave our team much faster test coverage.",
  },
  {
    company: "Geetham Enterprises",
    contact: "Parthiban",
    quote: "What stood out was how quickly the agent could generate and execute test scenarios. It made our testing process much more efficient.",
  },
  {
    company: "Grewbie",
    contact: "Yogeshwaren",
    quote: "A simple way to automate a lot of the testing work that usually takes our team hours.",
  },
  {
    company: "Borrowbox",
    contact: "Akash",
    quote: "Apex Node made testing feel much less manual. The automation saved us time and helped us catch issues earlier.",
  },
];