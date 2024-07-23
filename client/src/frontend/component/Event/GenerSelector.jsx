import React from 'react';

function GenreSelector({ selectedGenre, setSelectedGenre }) {
  const genres = ['Artificial Intelligence', 'Machine Learning', 'Human Computer Interaction', 'Software Development', 'Data Science', 'Networking'];

  return (
    <div className="flex justify-center mt-4">
      <nav className="w-full bg-light py-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="container mx-auto flex justify-between items-center text-[0.8vw]">
            {genres.map((genre) => (
              <a
                key={genre}
                className={`navelement mx-2 hover:underline ${selectedGenre === genre ? 'active text-indigo-500 text-[1vw]' : ''}`}
                href="#"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default GenreSelector;
