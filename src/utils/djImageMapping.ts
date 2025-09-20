// DJ Images mapping for scheduled shows
import djGadaffi from "@/assets/dj-gadaffi-original.jpeg";
import dj77 from "@/assets/dj-77-original.jpeg";
import djDede from "@/assets/dj-dede-original.jpeg";
import djJermaine from "@/assets/dj-jermaine-original.jpeg";
import djTonyG from "@/assets/dj-tony-g-original.jpeg";
import djKeu from "@/assets/dj-keu-original.jpeg";
import djTeachdem from "@/assets/dj-teachdem-original.jpeg";
import djCraig from "@/assets/dj-craig-original.jpeg";
import jeanMarie from "@/assets/jean-marie-original.jpeg";
import theMatrix from "@/assets/the-matrix-original.jpeg";
import docImanBlak from "@/assets/doc-iman-blak-original.jpeg";
import professorX from "@/assets/professor-x-original.jpg";
import djMigrane from "@/assets/dj-migrane-original.jpeg";
import djScreench from "@/assets/dj-screech-original.jpeg";
const djBadbin = "/lovable-uploads/b0224e5d-bbbb-46da-991e-c479ee6973ae.png";
import alopex from "@/assets/alopex-original.jpeg";
import dlcLioncore from "@/assets/dlc-lioncore-original.jpeg";

const djSmoothDaddy = "/lovable-uploads/0dff8266-ab20-4e95-8173-8e6383bad650.png";

// Map DJ/host names from the schedule to their images
export const djImageMap: Record<string, string> = {
  // Main DJs
  "DJ 77": dj77,
  "DJ Gadaffi": djGadaffi,
  "DJ 77 & DJ Gadaffi": djGadaffi, // Use Gadaffi's image for the duo
  "DJ DeDe": djDede,
  "DJ Jermaine Hard Drive": djJermaine,
  "DJ Tony G": djTonyG,
  "DJ Keu": djKeu,
  "DJ Teachdem": djTeachdem,
  "DJ Craig": djCraig,
  "DJ Migrane": djMigrane,
  "DJ Screech": djScreench,
  "DJ Badbin": djBadbin,
  "DJ Smooth Daddy": djSmoothDaddy,
  "DJ Tracy Virgo": "/lovable-uploads/672b3fe3-6592-486a-9c0a-719a6bc1a207.png", // DJ Tracy Virgo's image
  
  // Hosts and personalities
  "Jean Marie": jeanMarie,
  "Doc Iman Blak": docImanBlak,
  "Professor X": professorX,
  "Alopex/Dr Dawkins": alopex,
  "Daddy Lion Chandell": dlcLioncore,
  "DLC": dlcLioncore,
  "Neiima & DeDe": theMatrix,
  
  // Multi-host shows
  "Neiima & Poets": "/placeholder.svg", // No specific image available
  "Imaara": "/placeholder.svg", // No specific image available
  "Singing Melody": "/placeholder.svg", // No specific image available
  "Dale, Kane, Froggy & The Controversial Boss": "/placeholder.svg", // No specific image available
};

/**
 * Get DJ image for a given host name from the program schedule
 */
export function getDJImageForHost(hostName: string): string | null {
  return djImageMap[hostName] || null;
}