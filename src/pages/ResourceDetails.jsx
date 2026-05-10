import React from 'react';
import { ChevronRight, FileText, Database, Eye, Clock, ShieldCheck, Download, Bookmark, Share2, Sparkles, Lightbulb, Film, HelpCircle } from 'lucide-react';
import { RESOURCES } from '../constants';

export const ResourceDetails = () => {
  const resource = RESOURCES[0];

  return (
    <div className="max-w-7xl mx-auto px-margin py-8 w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 py-4 mb-4">
        {['Library', 'Biology', 'Genetics'].map((item) => (
          <React.Fragment key={item}>
            <button className="text-xs font-semibold text-outline hover:text-primary transition-colors uppercase tracking-wider">{item}</button>
            <ChevronRight size={14} className="text-outline" />
          </React.Fragment>
        ))}
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Advanced Molecular Biology</span>
      </nav>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Resource Card */}
          <div className="bg-surface-container-lowest shadow-paper rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="relative h-[450px] w-full bg-primary-container">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7jJfsVoGt3ar8UAigEVQ-o93t6c5GkrY6mJFAt_CXL4cdWR-s7kt_QmcrigZpXl80SHy5Cf0VqbPnI3ZP7OCTQ8dK2t1dsj61PIiDopesHaVgHWjTQUlrzY4ATN2zRs8Nn0F6lEyoLGtX5QuRfoWVrM2Ajis0n9Ek_K0HIa4PDgFMvjnkYCMrg4POzDWrJIhBo8QKxe5gMPH_QqcS4ykNGOsd4IDYi4tZ6OZK2LW0V71g3qUZ0KE_FGskZG2dZ8kAqfeSZA4qN-lp" 
                alt="DNA helix" 
                className="w-full h-full object-cover mix-blend-overlay opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-10">
                <span className="inline-block bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-3 py-1 rounded-full mb-4 self-start uppercase tracking-widest">
                  {resource.subject}
                </span>
                <h1 className="font-display text-3xl md:text-4xl text-on-primary mb-4 leading-tight font-bold max-w-2xl">
                  {resource.title}
                </h1>
                <p className="text-on-primary-container text-body-md opacity-90 max-w-2xl leading-relaxed">
                  A comprehensive guide to next-generation sequencing, including CRISPR applications and phenotypic mapping in complex organisms.
                </p>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="p-8 flex flex-wrap gap-12 border-b border-outline-variant/30 bg-surface-bright/50">
              <Stat icon={FileText} label="Format" value={resource.format} />
              <Stat icon={Database} label="File Size" value={resource.fileSize} />
              <Stat icon={Eye} label="Views" value={resource.views} />
              <Stat icon={Clock} label="Last Updated" value={resource.lastUpdated} />
            </div>

            {/* Abstract Section */}
            <div className="p-10">
              <h2 className="font-display text-h3 mb-6 text-primary border-l-4 border-primary pl-4">Abstract & Key Concepts</h2>
              <div className="prose max-w-none text-on-surface-variant space-y-6 leading-relaxed">
                <p>
                  This resource delves into the sophisticated methodologies governing modern genome sequencing. It covers the transition from Sanger sequencing to high-throughput Next-Generation Sequencing (NGS) platforms. Students will find detailed walkthroughs of library preparation, bioinformatics pipelines, and the ethical implications of genetic engineering.
                </p>
                <ul className="list-disc pl-5 space-y-3 font-medium">
                  <li>Single-molecule real-time (SMRT) sequencing principles</li>
                  <li>Comparative genomics and evolutionary conserved sequences</li>
                  <li>Epigenetic modifications and chromatin accessibility</li>
                  <li>Practical applications of Illumina and Nanopore technology</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-paper border border-outline-variant/20">
              <h3 className="text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Subject Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Molecular Biology', 'Genetics', 'Sequencing', 'PhD Level', 'Laboratory Methods'].map(tag => (
                  <span key={tag} className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-secondary hover:text-on-secondary cursor-default shadow-sm border border-outline-variant/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-tertiary-container p-6 rounded-xl text-on-tertiary-container flex flex-col justify-center items-center text-center shadow-paper relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <ShieldCheck size={32} className="mb-2 text-tertiary-fixed" />
              <p className="font-bold text-sm tracking-wide">Peer Reviewed</p>
              <p className="text-[10px] font-medium opacity-70 uppercase tracking-widest mt-1">University Verified</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Action Card */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-paper border border-outline-variant/20 border-t-8 border-primary">
            <button className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-md active:scale-95">
              <Download size={22} strokeWidth={2.5} />
              Download Now
            </button>
            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full border border-outline-variant text-primary py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
                <Bookmark size={18} />
                Save for Later
              </button>
              <button className="w-full text-on-surface-variant py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
                <Share2 size={18} />
                Share with Class
              </button>
            </div>
          </div>

          {/* Study Tip Box */}
          <div className="bg-primary-fixed text-on-primary-fixed p-8 rounded-xl relative overflow-hidden shadow-paper border border-primary/10">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12">
              <Lightbulb size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                Study Tip
              </h3>
              <p className="text-body-sm text-on-primary-fixed-variant leading-relaxed font-medium">
                When reviewing the genome sequencing workflow, focus on the "Library Prep" phase first. It's the most common topic in molecular biology exams this semester!
              </p>
            </div>
          </div>

          {/* Related Materials */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-paper border border-outline-variant/20">
            <h3 className="font-display text-lg font-bold mb-6 text-primary flex items-center gap-2">
              Related Materials
            </h3>
            <div className="space-y-2">
              <RelatedItem 
                icon={FileText} 
                title="CRISPR-Cas9 Basics" 
                meta="PDF • 4.5 MB" 
              />
              <RelatedItem 
                icon={Film} 
                title="Lab Intro: PCR Prep" 
                meta="Video • 12:40" 
              />
              <RelatedItem 
                icon={HelpCircle} 
                title="Sequencing Quiz" 
                meta="Interactive • 20 Qs" 
              />
            </div>
            <button className="w-full text-center text-primary font-bold text-xs uppercase tracking-widest mt-8 hover:underline active:opacity-70 transition-all">
              View All Related
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 group">
    <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-primary transition-transform group-hover:scale-110">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  </div>
);

const RelatedItem = ({ icon: Icon, title, meta }) => (
  <a className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group border border-transparent hover:border-outline-variant/30" href="#">
    <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shadow-sm">
      <Icon size={22} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">{title}</p>
      <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest opacity-60">{meta}</p>
    </div>
    <ChevronRight size={18} className="text-outline-variant group-hover:text-primary transition-all group-hover:translate-x-1" />
  </a>
);
