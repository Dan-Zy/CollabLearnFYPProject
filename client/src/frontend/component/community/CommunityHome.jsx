import React, { useState } from 'react';
import one from '../../../assets/globe_icon.png';
import { Navbar } from './NavBar';
import { SearchBar } from './SearchBar';
import { GenreSelector } from './GenerSelector';
import { CommunityCard } from './CommunityCard';

export function CommunityHome() {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const communities = [
    {
      id: 'hci_learner_1',
      img: one,
      title: 'HCI Learner 1',
      description: 'This is the tagline that unlocks human potential, enabling individuals to interact with technology efficiently.',
      postCount: '22k',
      memberCount: '5k',
      rating: '4.5/5',
    },
    {
      id: 'hci_learner_2',
      img: one,
      title: 'HCI Learner 2',
      description: 'This is the tagline that unlocks human potential, enabling individuals to interact with technology efficiently.',
      postCount: '22k',
      memberCount: '5k',
      rating: '4.5/5',
    },
  ];

  const filteredCommunities = communities.filter(
    (community) =>
      community.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === '' || community.title.includes(selectedGenre))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} {...community} activeTab={activeTab} />
          ))}
        </div>
      </div>
    </div>
  );
}
