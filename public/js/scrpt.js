let addRule = document.getElementById('addRule');
let allRules = document.querySelectorAll('ruleList')

addRule.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('working')
    let allRules = document.querySelectorAll('.rule');
    let newRule = document.createElement('input');
    newRule.type = 'text';
    newRule.name = `rules[]`;
    newRule.placeholder = `Rule ${allRules.length + 1}`;
    newRule.classList.add('rule');
    console.log(newRule)
    document.getElementById('ruleList').appendChild(newRule);
});