import { TeamMember } from '../types';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'salma-attar',
    name: 'Salma Attar',
    role: 'Founder & Master Beauty Educator',
    image: '/images/team/salma-attar-founder.jpg',
    bio: 'Founder and lead educator of SK Relax Beauty Academy & Salon in Satara. Certified in advanced hair styling, clinical skin aesthetics, permanent makeup (PMU), and bridal couture. She personally mentors every student with hands-on live demos and practical training.',
    expertise: [
      'Advanced Hair Cutting & Degree Geometry',
      'Clinical Aesthetics & Machine Knowledge',
      'Permanent Makeup (PMU) & Microblading',
      'Bridal Makeup & Traditional Saree Draping',
      'Academy Curriculum & Student Mentorship'
    ],
    isFounder: true,
    published: true
  },
  {
    id: 'styling-faculty',
    name: 'SK Relax Styling & Academy Faculty',
    role: 'Senior Hair & Skin Specialists',
    image: '/images/team/team-celebration-1.jpg',
    bio: 'Our dedicated studio and teaching team in Satara. Each faculty member brings practical salon expertise in skin treatments, modern coloring, hydra facials, and customer care.',
    expertise: [
      'Precision Butterfly & Layer Haircuts',
      'Hydra Facial & Skin Polishing',
      'Keratin & Hair Botox Treatments',
      'Student Dummy Practice Guidance'
    ],
    isFounder: false,
    published: true
  },
  {
    id: 'academy-support-team',
    name: 'Studio Care & Event Coordination',
    role: 'Salon Coordinators & Client Concierge',
    image: '/images/team/team-group-2.jpg',
    bio: 'Ensuring seamless appointment scheduling via WhatsApp, sterile treatment station hygiene, and welcoming batch get-togethers for all SK Relax academy graduates.',
    expertise: [
      'Appointment Scheduling & Client Care',
      'Strict Hygiene & Sanitization Standards',
      'Batch Coordination & Event Planning'
    ],
    isFounder: false,
    published: true
  }
];
