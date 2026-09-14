// Lore Container for Rosaflor Almirante

function initializeLore() {
  const loreContainer = document.querySelector('.lore-ui');
  
  if (!loreContainer) {
    console.warn('Lore container not found');
    return;
  }

  // Clear existing content
  loreContainer.innerHTML = '<h3>Lore</h3><div class="lore-content"></div>';
  
  const loreContent = loreContainer.querySelector('.lore-content');
  
  // Add your lore content here
  loreContent.innerHTML = `
    <ul>
      <p><b>Among the Merpeople, there are seven main branches. Albinos are revered as Saints for their species, as the color white is strongly associated with faith and purity. Because true Albinos are extremely rare, only one Saint is appointed per branch every century. When even Albinos cannot be found, Leucistic individuals may be chosen instead — though they are nearly as rare.</b></p>
      <br></br>
      <b><p>The Seven Main Branches:</p></b>
      <br></br>
      <b><li>Selachians – Sharks</li></b>
      <b><li>Delphinians – Dolphins</li></b>
      <b><li>Cetaceans – Whales</li></b>
      <b><li>Pinnipeds – Seals and Walruses</li></b>
      <b><li>Crustaceans – Shellfish, clawed, and chitin-armored folk</li></b>
      <b><li>Cephalopods – Tentacled beings such as Krakens, Octopuses, and Cuttlefish</li></b>
      <b><li>Abyssians – Deep-sea and trench dwellers</li></b>
      <br></br>
      <b><p>Each branch is permitted only one Saint per century. Appointing more is considered taboo, as God would view it as the branches competing with one another. Albinos and Leucistics are born only once every few centuries. Upon birth, they are immediately appointed as Saints. Unlike royalty or nobles, Saints are protectors, not rulers. They commonly serve as Admirals, Captains, or High Generals, leading the defense of their people in war. One such example is Admiral Rosaflor Almirante, known as the Saint of Gluttony for her legendary Megalodon appetite. While Saints safeguard their species, each branch may still appoint regular Merpeople as kings, queens, or nobles to rule their kingdoms.</p></b>
      <br></br>
      <b><u><p>Saints are the modern equivalent of what humans once called “The Pope”. Historically, they were known for ceaselessly praising God for bestowing the sacred gift of mana upon all living creatures. Each Saint is also granted a unique title that reflects their signature ability or defining trait in battle and service. These titles are bestowed by the elders of their branch shortly after the Saint’s appointment and are used with great reverence.  Saints may only marry other Saints. Taking a non-Saint as a spouse is considered a grave taboo or forbidden.</p></u></b>
    </ul>
    <div style="text-align: center; margin-top: 20px;">
      <img src="https://file.garden/aZscxMPZ-RVjxmp5/pride%20saint%20killed%20them%20all.png" alt="Saint of Gluttony" style="max-width: 50%; height: auto; border-radius: 4px;">
      <b><p style="margin-top: 8px; font-size: 12px; color: #666;">Saint of Gluttony's Glass Art, Known for her appetite in finding memories "delicious".</p></b>
    </div>
  `;
}

// Initialize lore when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLore);
} else {
  initializeLore();
}
