export const typingTexts = {
  easy: [
    "The sun was warm today. Birds sang in the trees, and a soft breeze moved through the open field. Everything felt calm and quiet, like the whole world had decided to slow down for a while. Children played near the pond, tossing small stones into the water and watching the ripples spread out in wide circles.",

    "She walked to the store to buy some milk and bread. The street was quiet, and only a few cars passed by as she made her way down the sidewalk. On her way back, she stopped to pet a small dog sitting by the gate, its tail wagging happily.",

    "It was a good day for a walk. The sky was clear, the air was cool, and the park was full of people enjoying the afternoon. Some were jogging along the path, while others sat on benches reading books or chatting with friends.",

    "He made a cup of tea and sat by the window. Outside, the rain had just stopped, leaving the streets clean and shiny under the fading light. Drops of water still clung to the leaves of the tree outside his house.",
  ],

  medium: [
    "Learning a new skill takes patience and consistent practice. Most people give up too early, right before real progress begins to show. The key is to keep going even when it feels slow, because small daily improvements add up over time into something significant and lasting.",

    "The city grew quickly over the past decade, adding new buildings and expanding public transportation. Traffic increased along with the population, prompting officials to invest in better infrastructure. Residents have mixed feelings about the rapid changes happening around them.",

    "Cooking a good meal often starts with fresh ingredients and a bit of planning. Even simple recipes can taste amazing when the right balance of flavors is used. Many chefs argue that timing matters just as much as the ingredients themselves.",

    "Technology continues to reshape how people communicate, work, and spend their free time. While some worry about losing personal connection, others see new tools as ways to bring people closer together across long distances.",
  ],

  hard: [
    "The archaeological expedition unearthed artifacts that complicated prevailing theories about the region's early inhabitants, prompting researchers to reconsider decades of established scholarship. Ceramic fragments, unusually intricate in their design, suggested a level of craftsmanship inconsistent with previous assumptions about the community's technological capabilities.",

    "Despite the committee's meticulous preparations, unforeseen logistical complications — ranging from equipment malfunctions to unpredictable weather patterns — threatened to derail the entire operation. Coordinators scrambled to reallocate resources while simultaneously managing the expectations of stakeholders who had invested considerable time and capital into the project's success.",

    "The neurosurgeon explained, with characteristic precision, that the procedure's success hinged on millimeter-level accuracy and an unwavering steadiness of hand throughout the extended operation. Even the slightest miscalculation, she noted, could result in irreversible complications, underscoring the immense pressure inherent in such delicate medical interventions.",

    "Economists remain divided over whether the proposed fiscal policy will stimulate sustainable growth or merely exacerbate existing inflationary pressures within an already volatile market. Proponents argue that targeted government spending could invigorate stagnant sectors, particularly within infrastructure and renewable energy.",
  ],
};

export function getRandomText(difficulty) {
  const passages = typingTexts[difficulty];
  const randomIndex = Math.floor(Math.random() * passages.length); // picks random numbers that will be later assigned as index//
  return passages[randomIndex];
}
