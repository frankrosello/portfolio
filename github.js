'use strict';

function githubDate(value) {
 const date = new Date(value);
 return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'});
}

function renderGitHubProfile(profile) {
 for (const [id, key] of [['repo-count','public_repos'],['follower-count','followers'],['following-count','following']]) {
  if (Number.isInteger(profile[key])) document.querySelector('#'+id).textContent = profile[key].toLocaleString();
 }
 document.querySelector('#github-stats').hidden = false;
}

function renderGitHubRepos(repos) {
 const valid = repos.filter(repo => typeof repo.full_name === 'string' && /^frankrosello\/[-\w.]+$/.test(repo.full_name) && !repo.private);
 const original = valid.filter(repo => !repo.fork);
 document.querySelector('#star-count').textContent = original.reduce((total,repo) => total+(Number(repo.stargazers_count)||0),0).toLocaleString();
 document.querySelector('#fork-count').textContent = original.reduce((total,repo) => total+(Number(repo.forks_count)||0),0).toLocaleString();
 const languageCounts = new Map();
 original.forEach(repo => {if (typeof repo.language === 'string') languageCounts.set(repo.language,(languageCounts.get(repo.language)||0)+1);});
 const languages = document.querySelector('#github-languages');
 languages.replaceChildren();
 [...languageCounts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).forEach(([language,total])=>{
  const badge=document.createElement('span'),amount=document.createElement('small');
  badge.className='language-badge';badge.append(language);amount.textContent=total+' repo'+(total===1?'':'s');badge.append(amount);languages.append(badge);
 });
 if (!languageCounts.size) languages.textContent = 'No repository languages available.';
 document.querySelector('#repo-summary-note').textContent = 'Primary language per repository; stars and forks across '+original.length+' original public repositories.';
 const list=document.querySelector('#github-repositories');
 list.replaceChildren();
 original.sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,6).forEach(repo=>{
  const card=document.createElement('article'),title=document.createElement('h4'),link=document.createElement('a'),description=document.createElement('p'),meta=document.createElement('div');
  card.className='repository-card';link.href='https://github.com/'+repo.full_name;link.target='_blank';link.rel='noopener';link.textContent=repo.name+' ↗';title.append(link);
  description.textContent=repo.description || (repo.name==='frankrosello'?'GitHub profile README.':'Source code and project files.');
  meta.className='repository-meta';
  for(const text of [repo.language, '★ '+(repo.stargazers_count||0), 'Forks '+(repo.forks_count||0),repo.archived?'Archived':null]) {
   if(text){const label=document.createElement('span');label.textContent=text;meta.append(label);}
  }
  const updated=githubDate(repo.pushed_at);
  if(updated){const time=document.createElement('time');time.textContent='Pushed '+updated;time.dateTime=new Date(repo.pushed_at).toISOString();meta.append(time);}
  card.append(title,description,meta);list.append(card);
 });
 if(!original.length)list.textContent='No public repositories available.';
}

function renderGitHubRelease(release) {
 const root=document.querySelector('#github-release');root.replaceChildren();root.hidden=true;
 if(!release||typeof release.html_url!=='string'||!release.html_url.startsWith('https://github.com/frankrosello/wow_launcher/releases/'))return;
 const heading=document.createElement('h3'),link=document.createElement('a'),date=document.createElement('p');
 heading.textContent='Latest launcher release';link.href=release.html_url;link.target='_blank';link.rel='noopener';link.textContent=release.name||release.tag_name;
 date.textContent='Published '+githubDate(release.published_at);root.append(heading,link,date);root.hidden=false;
}

async function getGitHubData(path) {
 const key='fr-github:'+path;
 try{const cached=JSON.parse(sessionStorage.getItem(key));if(cached&&Date.now()-cached.saved<900000)return cached.data;}catch{}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 try{
  const response=await fetch('https://api.github.com/'+path,{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
  if(response.status===404&&path.endsWith('/releases/latest'))return null;
  if(!response.ok)throw new Error('GitHub data unavailable');
  const data=await response.json();
  try{sessionStorage.setItem(key,JSON.stringify({saved:Date.now(),data}));}catch{}
  return data;
 }finally{clearTimeout(timer);}
}

async function getPublicRepos() {
 const repos=[];
 for(let page=1;page<=10;page++) {
  const batch=await getGitHubData('users/frankrosello/repos?per_page=100&type=owner&sort=pushed&page='+page);
  if(!Array.isArray(batch))throw new Error('Invalid repositories');
  repos.push(...batch);
  if(batch.length<100)break;
 }
 return repos;
}

async function loadGitHubData() {
 const state=document.querySelector('#github-data-status');
 let snapshot;
 try{
  const response=await fetch('assets/github-data.json');
  if(response.ok){snapshot=await response.json();renderGitHubProfile(snapshot.profile);renderGitHubRepos(snapshot.repos);renderGitHubEvents(snapshot.events);renderGitHubRelease(snapshot.release);state.textContent='Saved GitHub data · '+githubDate(snapshot.fetched_at)+' · checking for updates…';}
 }catch{}
 const results=await Promise.allSettled([
  getGitHubData('users/frankrosello'), getPublicRepos(),
  getGitHubData('users/frankrosello/events/public?per_page=20'),
  getGitHubData('repos/frankrosello/wow_launcher/releases/latest')
 ]);
 const renderers=[renderGitHubProfile,renderGitHubRepos,renderGitHubEvents,renderGitHubRelease];
 results.forEach((result,i)=>{if(result.status==='fulfilled')renderers[i](result.value);});
 const live=results.filter(result=>result.status==='fulfilled').length;
 if(live===4)state.textContent='GitHub data refreshed automatically. Public repositories only.';
 else if(snapshot)state.textContent='Some GitHub data is unavailable; saved data from '+githubDate(snapshot.fetched_at)+' is shown where needed.';
 else{state.textContent='Some GitHub data is unavailable right now. Visit my profile for the latest.';if(results[2].status==='rejected')document.querySelector('#activity-status').textContent='Recent activity unavailable.';}
}
function renderGitHubEvents(events){
 const list=document.querySelector('#activity-list');list.replaceChildren();
 const verbs={PushEvent:'Pushed code to',CreateEvent:'Created in',PullRequestEvent:'Updated a pull request in',IssuesEvent:'Updated an issue in',IssueCommentEvent:'Commented in',WatchEvent:'Starred',ForkEvent:'Forked',ReleaseEvent:'Published a release in',DeleteEvent:'Removed a branch or tag in',PullRequestReviewEvent:'Reviewed a pull request in'};
 const valid=events.filter(event=>event.repo&&typeof event.repo.name==='string'&&/^[-\w.]+\/[-\w.]+$/.test(event.repo.name)).slice(0,8);
 valid.forEach(event=>{
  const li=document.createElement('li'),icon=document.createElement('span'),text=document.createElement('span'),link=document.createElement('a'),date=document.createElement('time');
  icon.className='event-icon';icon.textContent='◇';icon.setAttribute('aria-hidden','true');text.className='event-text';text.append((verbs[event.type]||'Activity in')+' ');
  link.href='https://github.com/'+event.repo.name;link.target='_blank';link.rel='noopener';link.textContent=event.repo.name;text.append(link);
  date.className='event-date';const timestamp=new Date(event.created_at);if(!Number.isNaN(timestamp.getTime())){date.dateTime=timestamp.toISOString();date.textContent=timestamp.toLocaleDateString(undefined,{month:'short',day:'numeric'});}
  li.append(icon,text,date);list.append(li);
 });
 document.querySelector('#activity-status').textContent=valid.length?'Latest public events':'No recent public events available.';
}
loadGitHubData();
