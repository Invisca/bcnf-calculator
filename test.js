const assert=require('node:assert/strict');const {parse,solve,closure,analyze}=require('./core.js');
const run=(a,f)=>{const p=parse(a,f);return solve(p.attrs,p.fds);};
let s=run('A,B,C','A -> B\nB -> C');assert.deepEqual(s.leaves.map(n=>n.attrs),[['B','C'],['A','B']]);assert.equal(s.lost.length,0);
s=run('A,B,C','AB -> C\nC -> B');assert.equal(s.lost.length,1);assert.equal(s.lost[0].left.join(''),'AB');
// Projection must discover A -> C through B even when B is not in the subrelation.
assert(analyze(['A','C','D'],parse('A,B,C,D','A -> B\nB -> C').fds).checks.some(c=>c.left.join('')==='A'&&c.right.includes('C')&&!c.superkey));
s=run('A,B','');assert.equal(s.leaves.length,1);assert.deepEqual(s.tree.keys,[['A','B']]);
s=run('A,B','A -> A');assert.equal(s.leaves.length,1);
s=run('A,B','∅ -> A');assert.equal(s.leaves.length,2);
assert.equal(parse('student_id, course_id, grade','student_id, course_id -> grade').fds[0].left.length,2);
assert.throws(()=>parse('A,B','C -> A'));
// Independently verify every leaf and every split for a deterministic generated suite.
let seed=7;const rand=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};for(let i=0;i<120;i++){const attrs=['A','B','C','D'];const fds=Array.from({length:4},()=>({left:attrs.filter(()=>rand(3)===0),right:[attrs[rand(4)]]}));s=solve(attrs,fds);for(const leaf of s.leaves)assert(analyze(leaf.attrs,fds).checks.every(c=>c.superkey));function check(n){if(n.children){const [a,b]=n.children;const common=a.attrs.filter(x=>b.attrs.includes(x));assert(a.attrs.every(x=>closure(common,fds).includes(x)));assert.deepEqual([...new Set([...a.attrs,...b.attrs])].sort(),[...n.attrs].sort());n.children.forEach(check);}}check(s.tree);}
console.log('Passed examples, projection regression, edge cases, and 120 generated decomposition checks.');
