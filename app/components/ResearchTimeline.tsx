import React from "react";
import { ExternalLink } from "lucide-react";
import type { ResearchItem } from "../data/research";

// Enhanced collaborator data structure with images, direct designations, and updated roles.
const collaborators = [
  { 
    name: "Aman Chadha", 
    affiliation: "Ex: Apple, AWS, Nvidia & Stanford AI",
    designation: "GenAI @DeepMind",
    image: "https://imgs.search.brave.com/GFO6cz3tZZJJjWJn78_gB7kEf-IUalp6nfYPYOyjfSs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/YXZhdGFycy5odWdn/aW5nZmFjZS5jby92/MS9wcm9kdWN0aW9u/L3VwbG9hZHMvNjNh/NDc1NDkyN2YxZjY0/ZWQ3MjM4ZGFjL2FI/LWVKRi0zMWc0dm9m/OWp2MmdtSS5qcGVn",
    role: "Mentor"
  },
  { 
    name: "Vinija Jain", 
    affiliation: "Ex: Meta, Amazon, Oracle",
    designation: "ML Leadership @Google",
    image: "https://imgs.search.brave.com/-3SKQe_LIoDZCOdtbANeg0-i_4AnavoeTMqFvaDqtgo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMmdq/cWg5ajI2dW5wMC5j/bG91ZGZyb250Lm5l/dC9wcm9maWxlcGlj/LzYzOTQ4N2Y2NjNk/NzA2MGZhODBiYWQw/ZjkwODkxZmEz",
    role: "Mentor"
  },
  { 
    name: "Vasu Sharma", 
    affiliation: "Ex: Meta Superintelligence Labs (FAIR), Tesla Optimus, Citadel & CMU",
    designation: "Head of AI @PocketFM",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQho_spEHjmTAXiztnlHYY7B-bZlS2W1a1ahg&s",
    role: "Mentor"
  },
  { 
    name: "Amitava Das", 
    affiliation: "Former - AIISC, USC",
    designation: "Professor, CS, BITS Pilani",
    image: "https://imgs.search.brave.com/eKyoFYqecEf2ZIjjKb5kM7bSJYerpqH11Pg7e4EIFlc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Yml0cy1waWxhbmku/YWMuaW4vd3AtY29u/dGVudC91cGxvYWRz/L2FtaXRhdmEtbWlu/LTEucG5n",
    role: "Mentor"
  },
  { 
    name: "Prof. Parikshit N. Mahalle", 
    affiliation: "VIT, Pune",
    designation: "Dean - Academics, Professor",
    image: "https://imgs.search.brave.com/iauA-2fjQnbBbF2lnwUysxu4S87FTlpX8DInPnViR_I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb3Zl/cmltYWdlcy5pZ2kt/Z2xvYmFsLmNvbS9h/ZmZpbGlhdGVzLzVi/YTMxMmUwLTY1YjQt/NGI0OC05YTk1LTkz/ODdhOTk0YTMzMy5q/cGVn",
    role: "Mentor"
  },
  { 
    name: "Dr. Pradnya Dixit", 
    affiliation: "VIT, Pune",
    designation: "Associate Professor",
    image: "https://velocetechinsights.com/wp-content/uploads/2023/08/IMG_4609.jpg",
    role: "Mentor"
  },
  { 
    name: "Shashwat Bajpai", 
    affiliation: "Research Intern, Mercedes-Benz",
    designation: "MSc Student, BITS Pilani",
    image: "https://i1.rgstatic.net/ii/profile.image/11431281308658891-1739054005382_Q128/Shashwat-Bajpai-2.jpg",
    role: "Co-Author"
  },
  { 
    name: "Ashhar Aziz", 
    affiliation: "Amazon",
    designation: "Applied Scientist",
    image: "https://media.licdn.com/dms/image/v2/D5603AQHDVz0iThOYgg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724268136583?e=1779926400&v=beta&t=ASTmY8_sGv64_BrTFJO0fC84JylIcM_zkarGatpWzjo",
    role: "Co-Author"
  },
  { 
    name: "Subhankar Ghosh", 
    affiliation: "Xpectrum AI",
    designation: "Co-Founder",
    image: "data:image/jpeg;base64,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",
    role: "Co-Author"
  },
];

// Fallback logic for when images are unavailable (LinkedIn URLs often expire)
const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

export function ResearchTimeline({ items }: { items: ResearchItem[] }) {
  // Sort reverse-chronological (newest first) for academic standard
  const sorted = [...items].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="font-sans max-w-5xl mx-auto text-left flex flex-col gap-14">

      {/* Main Content: Publications */}
      <div className="w-full">
        <div className="flex justify-between items-end border-b-2 border-gray-400 dark:border-gray-600 pb-2 mb-6">
          <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Publications
          </span>
          <div className="flex gap-8 text-[14px] font-medium text-gray-600 dark:text-gray-400">
            <span className="w-16 text-center">Citations</span>
            <span className="w-12 text-center">Year</span>
          </div>
        </div>

        <div className="space-y-8">
          {sorted.map((item) => {
            const citations = (item as any).citations || 0;

            return (
              <article 
                key={`${item.title}-${item.year}`} 
                className="flex items-start justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 last:border-0"
              >
                {/* Info Column */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="text-[14px] text-[#006621] dark:text-[#81c995] mt-1">
                    {item.authors}
                  </div>
                  
                  <div className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
                    {item.venue}
                  </div>

                  {(item.overview || item.abstract) && (
                    <div className="text-[14px] text-gray-700 dark:text-gray-300 mt-2 leading-relaxed line-clamp-2">
                      {item.overview || item.abstract}
                    </div>
                  )}

                  {/* External Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {item.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          {link.label} <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats Column */}
                <div className="flex gap-8 shrink-0 text-[15px] text-gray-700 dark:text-gray-300 pt-1 font-medium">
                  <div className="w-16 text-center">
                    {citations > 0 ? citations : "-"}
                  </div>
                  <div className="w-12 text-center">{item.year}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Network & Collaborators Section: New Unified and Minimalist Card Layout */}
      <div className="w-full space-y-10 mb-10">
        <section>
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-5 pb-2 border-b border-gray-200 dark:border-gray-800 uppercase tracking-wider">
            Mentors & Co-Authors
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collaborators.map((person, idx) => (
              <li 
                key={idx} 
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4 text-center items-center"
              >
                {/* Minimalist Avatar */}
                <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                  {person.image ? (
                    <img 
                      src={person.image} 
                      alt={`Profile picture of ${person.name}`} 
                      className="h-full w-full object-cover" 
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-xl">
                      {getInitials(person.name)}
                    </span>
                  )}
                </div>
                
                {/* Details in a stack */}
                <div className="flex flex-col flex-1 w-full">
                  <div className="font-bold text-[15px] text-gray-950 dark:text-gray-50 leading-tight">
                    {person.name}
                  </div>
                  <div className="text-[12px] font-medium text-blue-700 dark:text-blue-400 mt-1 uppercase tracking-wider">
                    {person.role}
                  </div>
                  <div className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 mt-2 leading-snug">
                    {person.designation}
                  </div>
                  {person.affiliation && (
                    <div className="text-[12px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed font-normal">
                      {person.affiliation}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}