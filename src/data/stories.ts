export interface Character {
    id: string;
    name: string;
    avatar: string;
    introAudio: string;
    agentId: string;
  }
  
  export interface Story {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    characters: Character[];
  }
  
  export const stories: Story[] = [
    {
      id: "harry-potter",
      title: "Harry Potter",
      author: "J.K. Rowling",
      coverImage: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=1200&fit=crop",
      characters: [
        {
          id: "harry",
          name: "Harry",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harry&backgroundColor=b6e3f4",
          introAudio: "Hello there! I'm Harry Potter, the boy who lived. Care to chat about magic and adventure?",
          agentId: "REPLACE_WITH_AGENT_ID_HARRY"
        },
        {
          id: "hermione",
          name: "Hermione",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hermione&backgroundColor=ffd5dc",
          introAudio: "Hi! I'm Hermione Granger. Did you know there are over 700 ways to commit a foul in Quidditch?",
          agentId: "REPLACE_WITH_AGENT_ID_HERMIONE"
        },
        {
          id: "dumbledore",
          name: "Dumbledore",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dumbledore&backgroundColor=c0aede",
          introAudio: "Ah, welcome young one. I am Albus Dumbledore. Remember, happiness can be found in the darkest of times.",
          agentId: "REPLACE_WITH_AGENT_ID_DUMBLEDORE"
        }
      ]
    },
    {
      id: "pride-prejudice",
      title: "Pride & Prejudice",
      author: "Jane Austen",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop",
      characters: [
        {
          id: "elizabeth",
          name: "Elizabeth",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth&backgroundColor=ffd5dc",
          introAudio: "Good day! I am Elizabeth Bennet. I find that a lively conversation is the finest entertainment.",
          agentId: "REPLACE_WITH_AGENT_ID_ELIZABETH"
        },
        {
          id: "darcy",
          name: "Mr. Darcy",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=darcy&backgroundColor=b6e3f4",
          introAudio: "I am Fitzwilliam Darcy. I confess I am not skilled at conversing easily with strangers, but I shall try.",
          agentId: "REPLACE_WITH_AGENT_ID_DARCY"
        }
      ]
    },
    {
      id: "great-gatsby",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "https://images.unsplash.com/photo-1514894780887-121968d00567?w=800&h=1200&fit=crop",
      characters: [
        {
          id: "gatsby",
          name: "Gatsby",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gatsby&backgroundColor=ffdfbf",
          introAudio: "Hello, old sport! I'm Jay Gatsby. Won't you join me for a party at West Egg?",
          agentId: "REPLACE_WITH_AGENT_ID_GATSBY"
        },
        {
          id: "nick",
          name: "Nick",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nick&backgroundColor=b6e3f4",
          introAudio: "I'm Nick Carraway. I've been witness to remarkable events this summer in New York.",
          agentId: "REPLACE_WITH_AGENT_ID_NICK"
        },
        {
          id: "daisy",
          name: "Daisy",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=daisy&backgroundColor=ffd5dc",
          introAudio: "Oh hello darling! I'm Daisy Buchanan. Isn't everything just wonderful?",
          agentId: "REPLACE_WITH_AGENT_ID_DAISY"
        }
      ]
    },
    {
      id: "lord-of-rings",
      title: "Lord of the Rings",
      author: "J.R.R. Tolkien",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
      characters: [
        {
          id: "frodo",
          name: "Frodo",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frodo&backgroundColor=d1f4d1",
          introAudio: "Hello friend! I'm Frodo Baggins of the Shire. The road goes ever on and on.",
          agentId: "REPLACE_WITH_AGENT_ID_FRODO"
        },
        {
          id: "gandalf",
          name: "Gandalf",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gandalf&backgroundColor=e8e8e8",
          introAudio: "I am Gandalf the Grey! A wizard is never late, nor is he early.",
          agentId: "REPLACE_WITH_AGENT_ID_GANDALF"
        },
        {
          id: "aragorn",
          name: "Aragorn",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aragorn&backgroundColor=c9b896",
          introAudio: "I am Aragorn, son of Arathorn. Not all those who wander are lost.",
          agentId: "REPLACE_WITH_AGENT_ID_ARAGORN"
        }
      ]
    },
    {
      id: "alice-wonderland",
      title: "Alice in Wonderland",
      author: "Lewis Carroll",
      coverImage: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&h=1200&fit=crop",
      characters: [
        {
          id: "alice",
          name: "Alice",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice&backgroundColor=b6e3f4",
          introAudio: "Curiouser and curiouser! I'm Alice, and I've had the most peculiar adventures!",
          agentId: "REPLACE_WITH_AGENT_ID_ALICE"
        },
        {
          id: "madhatter",
          name: "Mad Hatter",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=madhatter&backgroundColor=ffd700",
          introAudio: "Why is a raven like a writing desk? I'm the Mad Hatter! Would you like some tea?",
          agentId: "REPLACE_WITH_AGENT_ID_MADHATTER"
        },
        {
          id: "cheshire",
          name: "Cheshire Cat",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cheshire&backgroundColor=dda0dd",
          introAudio: "We're all mad here! I'm the Cheshire Cat. Which way do you want to go?",
          agentId: "REPLACE_WITH_AGENT_ID_CHESHIRE"
        }
      ]
    }
  ];
  