async function test() {
  const loginRes = await fetch('https://baitul-smartflow-api-1777252841.fly.dev/api/login-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username: 'budi_santoso', password: 'password123'})
  });
  const {token} = await loginRes.json();
  console.log('Got token:', token);
  
  const form = new FormData();
  form.append('nama_muzakki', 'Budi Santoso');
  form.append('jenis_zakat', 'Zakat Fitrah');
  form.append('nominal', '45000');
  
  console.log('Sending Zakat request...');
  const zakatRes = await fetch('https://baitul-smartflow-api-1777252841.fly.dev/api/zakat', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: form
  });
  
  const result = await zakatRes.text();
  console.log('Result HTTP status:', zakatRes.status);
  console.log('Result body:', result);
}
test();