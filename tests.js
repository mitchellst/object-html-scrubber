import test from 'ava';
import scrubber from './index';

test('eliminates scripts and iframes by default', t => {
  let scriptText = 'hello <script>malicious();</script>',
    frameText = 'goodbye<iframe src="malicious.com"></iframe>',
    scriptScrubbed = scrubber({scriptText}),
    frameScrubbed = scrubber({frameText});
  t.is(scriptScrubbed.scrubbed.scriptText, 'hello ');
  t.is(frameScrubbed.scrubbed.frameText, 'goodbye');

});

test('leaves scripts and iframes alone if other selector passed', t => {
  let testText = '<script>whoKnew();</script><p>good</p><p class="kill">bad</p><iframe></iframe>',
    scrubbed = scrubber({testText}, ['.kill']);
  t.is(scrubbed.scrubbed.testText, '<script>whoKnew();</script><p>good</p><iframe></iframe>')

});

test('finds nested version of selector', t => {
  let nested = '<div><p>Hello</p><script>pwn3d();</script></div>',
    scrubbed = scrubber({nested});
  t.is(scrubbed.scrubbed.nested, '<div><p>Hello</p></div>');

});

test('elminates multiple offending elements if present.', t => {
  let nested = '<div><p>Hello</p><script>pwn3d();</script></div><iframe> \
  </iframe><script>different</script>',
    scrubbed = scrubber({nested});
  t.is(scrubbed.scrubbed.nested, '<div><p>Hello</p></div>');
});

test('eliminates off-case offending elements', t => {
  let nested = '<div><p>Hello</p><sCrIpt>pwn3d();</ScrIPt></div><iframe> \
  </iframe><script>different</script>',
    scrubbed = scrubber({nested});
  t.is(scrubbed.scrubbed.nested, '<div><p>Hello</p></div>');
})

test('escapes incident output', t => {
  let nested = '<div><p>Hello</p><sCrIpt>pwn3d();</ScrIPt></div><iframe> \
  </iframe><script>different</script>',
    scrubbed = scrubber({nested});
  t.is(scrubbed.incidents.length, 3);
  t.is(scrubbed.incidents[0], '&lt;script&gt;pwn3d();&lt;/script&gt;');
});

