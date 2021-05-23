describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500');
    await page.waitForTimeout(500);
  });

  // test 1 is given
  it('Test1: Initial Home Page - Check for 10 Journal Entries', async () => {
    const numEntries = await page.$$eval('journal-entry', (entries) => {
      return entries.length;
    });
    expect(numEntries).toBe(10);
  });

  // test 2 is given
  it('Test2: Make sure <journal-entry> elements are populated', async () => {
    let allArePopulated = true;
    let data, plainValue;
    const entries = await page.$$('journal-entry');
    for (let i = 0; i < entries.length; i++) {
      data = await entries[i].getProperty('entry');
      plainValue = await data.jsonValue();
      if (plainValue.title.length == 0) { allArePopulated = false; }
      if (plainValue.date.length == 0) { allArePopulated = false; }
      if (plainValue.content.length == 0) { allArePopulated = false; }
    }
    expect(allArePopulated).toBe(true);
  }, 30000);

  it('Test3: Clicking first <journal-entry>, new URL should contain /#entry1', async () => {
    await page.click('journal-entry');
    const url = await page.url();
    expect(url).toMatch(/\/#entry1/g);
  });

  it('Test4: On first Entry page - checking page header title', async () => {
    const headerContent = await page.$eval('h1', el => el.innerText);
    expect(headerContent).toBe('Entry 1');
  });

  it('Test5: On first Entry page - checking <entry-page> contents', async () => {
    const expectedEntry = { 
      title: 'You like jazz?',
      date: '4/25/2021',
      content: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
      image: {
        src: 'https://i1.wp.com/www.thepopcornmuncher.com/wp-content/uploads/2016/11/bee-movie.jpg?resize=800%2C455',
        alt: 'bee with sunglasses'
      }
    };
    const entryTitle = await page.$eval('pierce/.entry-title', el => el.innerText);
    const entryDate = await page.$eval('pierce/.entry-date', el => el.innerText);
    const entryContent = await page.$eval('pierce/.entry-content', el => el.innerText);
    const entryImageSrc = await page.$eval('pierce/.entry-image', el => el.getAttribute('src'));
    const entryImageAlt = await page.$eval('pierce/.entry-image', el => el.getAttribute('alt'));
    expect(entryTitle).toBe(expectedEntry.title);
    expect(entryDate).toBe(expectedEntry.date);
    expect(entryContent).toBe(expectedEntry.content);
    expect(entryImageSrc).toBe(expectedEntry.image.src);
    expect(entryImageAlt).toBe(expectedEntry.image.alt);
  }, 10000);

  it('Test6: On first Entry page - checking <body> element classes', async () => {
    const bodyClassAttribute = await page.$eval('body', el => el.getAttribute('class'));
    expect(bodyClassAttribute).toBe('single-entry');
  });

  it('Test7: Clicking the settings icon, new URL should contain #settings', async () => {
    await page.click('img[alt="settings"]');
    const url = await page.url();
    expect(url).toMatch(/#settings/g);
  });

  it('Test8: On Settings page - checking page header title', async () => {
    const headerContent = await page.$eval('h1', el => el.innerText);
    expect(headerContent).toBe('Settings');
  });

  it('Test9: On Settings page - checking <body> element classes', async () => {
    const bodyClassAttribute = await page.$eval('body', el => el.getAttribute('class'));
    expect(bodyClassAttribute).toBe('settings');
  });

  it('Test10: Clicking the back button, new URL should be /#entry1', async() => {
    await page.goBack();
    const url = await page.url();
    expect(url).toMatch(/\/#entry1/g);
  });

  it('Test11: Clicking the back button once should bring the user back to the home page', async () => {
    await page.goBack();
    const url = await page.url();
    expect(url).toBe('http://127.0.0.1:5500/');
  });

  it('Test12: When the user if on the homepage, the header title should be “Journal Entries”', async () => {
    const headerContent = await page.$eval('h1', el => el.innerText);
    expect(headerContent).toBe('Journal Entries');
  });

  it('Test13: On the home page the <body> element should not have any class attribute', async () => {
    const bodyClassAttribute = await page.$eval('body', el => el.getAttribute('class'));
    expect(bodyClassAttribute).toBe('');
  });

  it('Test14: Verify the url is correct when clicking on the second entry', async () => {
    await page.$$eval('journal-entry', (entries) => {
      entries[1].click();
    });
    const url = await page.url();
    expect(url).toMatch(/\/#entry2/g);
  });

  it('Test15: Verify the title is current when clicking on the second entry', async () => {
    const headerContent = await page.$eval('h1', el => el.innerText);
    expect(headerContent).toBe('Entry 2');
  });

  it('Test16: Verify the entry page contents is correct when clicking on the second entry', async () => {
    const expectedEntry = { 
      title: 'Run, Forrest! Run!',
      date: '4/26/2021',
      content: "Mama always said life was like a box of chocolates. You never know what you're gonna get.",
      image: {
        src: 'https://s.abcnews.com/images/Entertainment/HT_forrest_gump_ml_140219_4x3_992.jpg',
        alt: 'forrest running'
      }
    };

    const entryTitle = await page.$$eval('pierce/.entry-title', (entries) => {
      return entries[1].innerText;
    });

    const entryDate = await page.$$eval('pierce/.entry-date', (entries) => {
      return entries[1].innerText;
    });

    const entryContent = await page.$$eval('pierce/.entry-content', (entries) => {
      return entries[1].innerText;
    });

    const entryImageSrc = await page.$$eval('pierce/.entry-image', (entries) => {
      return entries[1].getAttribute('src');
    });

    const entryImageAlt = await page.$$eval('pierce/.entry-image', (entries) => {
      return entries[1].getAttribute('alt');
    });

    expect(entryTitle).toBe(expectedEntry.title);
    expect(entryDate).toBe(expectedEntry.date);
    expect(entryContent).toBe(expectedEntry.content);
    expect(entryImageSrc).toBe(expectedEntry.image.src);
    expect(entryImageAlt).toBe(expectedEntry.image.alt);
  }, 20000);

  it('Test17: Verify the url is correct when clicking on the tenth entry', async () => {
    await page.goBack();
    await page.$$eval('journal-entry', (entries) => {
      entries[9].click();
    });
    const url = await page.url();
    expect(url).toMatch(/\/#entry10/g);
  });

  it('Test18: Verify the audio element exists on the tenth entry', async () => {
    const entryAudioSrc = await page.$$eval('pierce/.entry-audio', (entries) => {
      return entries[1].getAttribute('src');
    });
    expect(entryAudioSrc).toBe('https://drive.google.com/uc?export=download&id=1luYh909US7ZBFe6uo440Vv_LNnRdnErT');
  });

  it('Test19: Verify that navigating back takes you home', async () => {
    await page.goBack();
    const url = await page.url();
    expect(url).toBe('http://127.0.0.1:5500/');
  });

  it('Test20: Verify favicon is set correctly', async () => {
    const faviconUrl = await page.$eval('link[rel="icon"]', el => el.getAttribute('href'));
    expect(faviconUrl).toBe('./styles/favicon.ico');
  });
});
