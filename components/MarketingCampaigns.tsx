
import React from 'react';
import type { MarketingVideo } from '../types';
import { PlayIcon, BayutIcon } from './Icons';
import { motion } from 'framer-motion';
import { StaggeredGrid, AnimatedItem } from './AnimatedWrappers';

interface MarketingCampaignsProps {
  socialVideos: MarketingVideo[];
}

const VideoCard: React.FC<{ video: MarketingVideo }> = ({ video }) => {
  return (
    <motion.div 
      className="group relative rounded-2xl overflow-hidden shadow-lg bg-black"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[4/5] sm:aspect-video">
        <motion.img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Play Button & Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <PlayIcon className="w-8 h-8 text-white ml-1" />
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
            <h4 className="text-white font-bold text-lg sm:text-xl leading-tight mb-2 drop-shadow-md">{video.title}</h4>
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">Watch Ad</span>
            </div>
        </div>
      </a>
    </motion.div>
  );
};

const MarketingCampaigns: React.FC<MarketingCampaignsProps> = ({ socialVideos }) => {
  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-center justify-between mb-8 sm:mb-12 px-2">
             <h3 className="text-2xl font-bold text-[#4A2C5A]">Social Media Campaigns</h3>
             <div className="h-[1px] flex-1 bg-[#4A2C5A]/10 ml-8 hidden sm:block"></div>
        </div>
        <StaggeredGrid>
          {socialVideos.map(video => 
            <AnimatedItem key={video.id}>
              <VideoCard video={video} />
            </AnimatedItem>
          )}
        </StaggeredGrid>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A5B64] to-[#1e4248] rounded-3xl -rotate-1 opacity-10 transform scale-105 blur-lg"></div>
        <div className="relative bg-gradient-to-r from-[#2A5B64] to-[#1e4248] p-8 sm:p-12 rounded-3xl shadow-2xl text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Strategic Listings Partners</h3>
                    <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                        To ensure maximum reach and occupancy, our properties are prioritized on the region's leading real estate platforms.
                    </p>
                </div>
                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <BayutIcon className="w-10 h-10 text-white mx-auto mb-2 opacity-90" />
                        <span className="block font-bold tracking-widest text-sm uppercase">Bayut</span>
                    </div>
                    <div className="w-[1px] h-10 bg-white/20"></div>
                    <div className="text-center">
                         <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                             <span className="text-2xl font-black">A</span>
                         </div>
                        <span className="block font-bold tracking-widest text-sm uppercase">Aqar</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaigns;
