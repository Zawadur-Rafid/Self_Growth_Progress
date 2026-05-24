(function(){
  // state
  let skills = []
  let currentTab = 'active'

  // elements
  const addSkillBtn = document.getElementById('addSkillBtn')
  const modal = document.getElementById('modal')
  const skillForm = document.getElementById('skillForm')
  const cancelBtn = document.getElementById('cancelBtn')
  const activeList = document.getElementById('activeList')
  const completedList = document.getElementById('completedList')
  const tabs = document.querySelectorAll('.tab')
  const statActive = document.getElementById('statActive')
  const statDue = document.getElementById('statDue')
  const statCompleted = document.getElementById('statCompleted')

  async function load(){
    try {
      const res = await fetch('/api/skills');
      skills = await res.json();
      render();
    } catch(e) { 
      console.error('Failed to load skills', e);
      skills = []; 
    }
  }

  function daysLeft(targetISO){
    const now = new Date();
    const target = new Date(targetISO + 'T23:59:59')
    const msPerDay = 24*60*60*1000
    return Math.ceil((target - now)/msPerDay)
  }

  function createCard(skill){
    const el = document.createElement('div')
    el.className = 'card'
    const head = document.createElement('div'); head.className='card-head'
    const titleWrap = document.createElement('div')
    const title = document.createElement('div'); title.textContent = skill.name; title.style.fontWeight='700'
    const cat = document.createElement('div'); cat.className='category'; cat.textContent = skill.category
    titleWrap.appendChild(title); titleWrap.appendChild(cat)
    head.appendChild(titleWrap)

    const right = document.createElement('div')
    const progressPct = Math.max(0,Math.min(100,Number(skill.progress)||0))
    const progressWrap = document.createElement('div'); progressWrap.className='progress-wrap';
    const bar = document.createElement('div'); bar.className='progress-bar'; bar.style.width = progressPct+'%'
    progressWrap.appendChild(bar)

    right.appendChild(progressWrap)
    head.appendChild(right)

    el.appendChild(head)

    if(skill.notes){
      const note = document.createElement('div'); note.className='note'; note.textContent = skill.notes; el.appendChild(note)
    }

    if(skill.status === 'active'){
      // Time Progress Calculation
      const start = new Date(skill.created_at || skill.createdAt).getTime()
      const end = new Date((skill.target_date || skill.targetDate || '').slice(0,10) + 'T23:59:59').getTime()
      const now = Date.now()
      
      let timePct = 0
      if (end > start) {
        timePct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100))
      } else {
        timePct = 100
      }

      const timeLabel = document.createElement('div'); timeLabel.className = 'time-progress-label'; timeLabel.textContent = 'Time Elapsed'
      const timeWrap = document.createElement('div'); timeWrap.className = 'time-progress-wrap'
      const timeBar = document.createElement('div'); timeBar.className = 'time-progress-bar'
      timeBar.style.width = timePct + '%'
      
      if (timePct < 40) timeBar.style.backgroundColor = '#7cffc6'
      else if (timePct < 80) timeBar.style.backgroundColor = '#ffcf5c'
      else timeBar.style.backgroundColor = '#ff6b6b'

      timeWrap.appendChild(timeBar)
      el.appendChild(timeLabel)
      el.appendChild(timeWrap)
    }

    const footer = document.createElement('div'); footer.className='card-footer'

    if(skill.status === 'active'){
      const dl = daysLeft((skill.target_date || skill.targetDate || '').slice(0,10))
      const cd = document.createElement('div'); cd.className='countdown'
      if(dl < 0) { cd.textContent = 'Overdue'; cd.classList.add('red') }
      else if(dl <= 7) { cd.textContent = dl + ' days'; cd.classList.add('red') }
      else if(dl <=30) { cd.textContent = dl + ' days'; cd.classList.add('gold') }
      else { cd.textContent = dl + ' days'; cd.classList.add('green') }
      footer.appendChild(cd)

      const actions = document.createElement('div')
      actions.style.display = 'flex'
      actions.style.gap = '8px'

      const mark = document.createElement('button'); mark.className='btn'; mark.textContent='Mark Done'
      mark.addEventListener('click', async ()=>{
        const completedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await fetch(`/api/skills/${skill.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed', progress: 100, completedAt })
        });
        load();
      })
      actions.appendChild(mark)

      const del = document.createElement('button'); del.className='btn'; del.textContent='Remove'; del.style.color='#ff6b6b'
      del.addEventListener('click', async ()=>{
        if(confirm(`Remove "${skill.name}"?`)){
          await fetch(`/api/skills/${skill.id}`, { method: 'DELETE' });
          load();
        }
      })
      actions.appendChild(del)

      footer.appendChild(actions)
    } else {
      const done = document.createElement('div'); done.innerHTML = '<span class="badge">Goal achieved!</span>'
      footer.appendChild(done)
      const when = document.createElement('div'); when.className='note'; when.textContent = 'Completed ' + new Date(skill.completed_at || skill.completedAt || skill.created_at || skill.createdAt).toLocaleDateString(); footer.appendChild(when)
    }

    el.appendChild(footer)
    return el
  }

  function render(){
    activeList.innerHTML=''
    completedList.innerHTML=''

    const active = skills.filter(s=>s.status!=='completed')
    const completed = skills.filter(s=>s.status==='completed')

    active.forEach(s=> activeList.appendChild(createCard(s)))
    completed.forEach(s=> completedList.appendChild(createCard(s)))

    statActive.textContent = active.length
    statCompleted.textContent = completed.length
    const dueSoonCount = active.filter(s=> daysLeft((s.target_date || s.targetDate || '').slice(0,10)) <= 30).length
    statDue.textContent = dueSoonCount

    document.getElementById('activeList').classList.toggle('hidden', currentTab!=='active')
    document.getElementById('completedList').classList.toggle('hidden', currentTab!=='completed')
  }

  addSkillBtn.addEventListener('click', ()=>{ modal.classList.remove('hidden') })
  cancelBtn.addEventListener('click', ()=>{ modal.classList.add('hidden'); skillForm.reset() })

  skillForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(skillForm)
    const name = fd.get('name').toString().trim()
    const category = fd.get('category').toString()
    const target = fd.get('target').toString()
    const notes = fd.get('notes').toString()
    const progress = Number(fd.get('progress')||0)
    if(!name||!target) return
    
    const skill = { 
      id: Date.now().toString(36)+Math.random().toString(36).slice(2,6), 
      name, 
      category, 
      targetDate: target, 
      notes, 
      progress, 
      status:'active' 
    }
    
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    });
    
    load();
    skillForm.reset(); 
    modal.classList.add('hidden')
  })

  tabs.forEach(t=> t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'))
    t.classList.add('active'); currentTab = t.dataset.tab; render()
  }))

  load();
  modal.classList.add('hidden');
})();
