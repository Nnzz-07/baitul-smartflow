        // Cek autentikasi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            const username = localStorage.getItem('username');

            if (!token) {
                // Belum login, tendang kembali ke login
                window.location.href = 'login.html';
                return;
            }

            // Tampilkan data user
            document.getElementById('usernameDisplay').innerText = username;
            document.getElementById('greetingName').innerText = username;
            document.getElementById('roleDisplay').innerText = role;

            if (role === 'admin') {
                document.getElementById('adminNotice').classList.remove('hidden');
                renderAdminDashboard();
            } else {
                document.getElementById('memberNotice').classList.remove('hidden');
                fetchMemberDashboardData(token);
                renderMemberMenu();
            }
        });

        function showFeature(featureName) {
            Swal.fire({
                title: 'Fitur ' + featureName,
                text: 'Fitur ini belum terhubung ke API (sedang dalam tahap pengembangan).',
                icon: 'info',
                confirmButtonColor: '#059669',
            });
        }

        function handleLogout() {
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Sesi Anda akan diakhiri.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#059669',
                cancelButtonColor: '#dc2626',
                confirmButtonText: 'Ya, Keluar',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                }
            })
        }

        // --- Change Password Functions ---
        function openChangePasswordModal() {
            document.getElementById('changePasswordModal').classList.remove('hidden');
        }

        function closeChangePasswordModal() {
            document.getElementById('changePasswordModal').classList.add('hidden');
            document.getElementById('changePasswordForm').reset();
        }

        async function submitChangePassword(e) {
            e.preventDefault();
            
            const btn = document.getElementById('btnSubmitChangePassword');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://baitul-smartflow-api-1777252841.fly.dev/api/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ oldPassword, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Kata sandi berhasil diubah! Silakan login kembali dengan sandi baru.',
                        confirmButtonColor: '#059669'
                    }).then(() => {
                        // Paksa user untuk login kembali dengan password baru
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        localStorage.removeItem('username');
                        window.location.href = 'login.html';
                    });
                } else {
                    Swal.fire('Gagal', data.message || 'Kata sandi lama salah atau gagal mengubah sandi.', 'error');
                }
            } catch (error) {
                Swal.fire('Kesalahan', 'Gagal terhubung ke server API.', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save"></i> Simpan';
            }
        }

        // Render Dashboard untuk Admin
        function renderAdminDashboard() {
            // Karena admin memiliki banyak menu, kita buat tampilan statis representatif
            document.getElementById('apiContent').innerHTML = `
                <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Saldo Infaq</p>
                            <h3 class="text-2xl font-bold text-gray-800">Rp 15.450.000</h3>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl"><i class="fa-solid fa-wallet"></i></div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Penerimaan Zakat</p>
                            <h3 class="text-2xl font-bold text-gray-800">120 Jiwa</h3>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl"><i class="fa-solid fa-hand-holding-heart"></i></div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Pendaftar Qurban</p>
                            <h3 class="text-2xl font-bold text-gray-800">15 Hewan</h3>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl"><i class="fa-solid fa-cow"></i></div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Aset</p>
                            <h3 class="text-2xl font-bold text-gray-800">45 Item</h3>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl"><i class="fa-solid fa-boxes-stacked"></i></div>
                    </div>
                </div>
            `;

            document.getElementById('quickMenu').innerHTML = `
                <button onclick="openAdminDataModal('Infaq')" class="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition text-center text-emerald-700 font-medium">
                    <i class="fa-solid fa-cash-register block text-3xl mb-2 text-emerald-500"></i> Kelola Infaq
                </button>
                <button onclick="openAdminDataModal('zakat')" class="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition text-center text-emerald-700 font-medium">
                    <i class="fa-solid fa-scale-balanced block text-3xl mb-2 text-emerald-500"></i> Data Zakat
                </button>
                <button onclick="openAdminDataModal('qurban')" class="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition text-center text-emerald-700 font-medium">
                    <i class="fa-solid fa-file-invoice block text-3xl mb-2 text-emerald-500"></i> Rekap Qurban
                </button>
                <button onclick="openAdminDataModal('inventory')" class="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition text-center text-emerald-700 font-medium">
                    <i class="fa-solid fa-clipboard-list block text-3xl mb-2 text-emerald-500"></i> Master Inventaris
                </button>
            `;
        }

        // Fetch Dashboard Member langsung dari API Real (Protected Endpoint)
        async function fetchMemberDashboardData(token) {
            try {
                const response = await fetch('https://baitul-smartflow-api-1777252841.fly.dev/api/user/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Format tampilan card bedasarkan data real API Member
                    document.getElementById('apiContent').innerHTML = `
                        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald-500">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Zakat</p>
                                    <h3 class="text-2xl font-bold text-gray-800">
                                        Rp ${(data.data?.total_zakat || 0).toLocaleString('id-ID')}
                                    </h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Infaq</p>
                                    <h3 class="text-2xl font-bold text-gray-800">
                                        Rp ${(data.data?.total_Infaq || 0).toLocaleString('id-ID')}
                                    </h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl"><i class="fa-solid fa-money-bill-transfer"></i></div>
                            </div>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500 col-span-1 md:col-span-2">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Partisipasi Qurban</p>
                                    <h3 class="text-2xl font-bold text-gray-800">${data.data?.total_qurban || 0} Ekor <span class="text-sm font-normal text-gray-500">tercatat</span></h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl"><i class="fa-solid fa-cow"></i></div>
                            </div>
                        </div>
                    `;
                } else {
                    throw new Error('Gagal mengambil data member');
                }
            } catch (error) {
                document.getElementById('apiContent').innerHTML = `
                    <div class="bg-red-50 p-6 rounded-xl shadow-md border border-red-200 col-span-4 text-center text-red-600">
                        <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                        <p>Gagal memuat data dari API. Pastikan token masih berlaku.</p>
                        <button onclick="handleLogout()" class="mt-4 underline text-sm">Login ulang</button>
                    </div>
                `;
            }
        }

        function renderMemberMenu() {
            document.getElementById('quickMenu').innerHTML = `
                <button onclick="openZakatModal()" class="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-center text-blue-700 font-medium">
                    <i class="fa-solid fa-money-bill-transfer block text-3xl mb-2 text-blue-500"></i> Bayar Zakat
                </button>
                <button onclick="showFeature('Daftar Qurban')" class="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-center text-blue-700 font-medium">
                    <i class="fa-solid fa-hand-holding-heart block text-3xl mb-2 text-blue-500"></i> Daftar Qurban
                </button>
                <button onclick="showFeature('Riwayat Infaq')" class="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-center text-blue-700 font-medium">
                    <i class="fa-solid fa-clock-rotate-left block text-3xl mb-2 text-blue-500"></i> Riwayat Infaq
                </button>
                <button onclick="showFeature('Laporan Masjid')" class="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-center text-blue-700 font-medium">
                    <i class="fa-solid fa-chart-pie block text-3xl mb-2 text-blue-500"></i> Laporan Masjid
                </button>
            `;
        }

        // --- Admin Data Modal Functions ---
        async function openAdminDataModal(type) {
            document.getElementById('adminDataModal').classList.remove('hidden');
            const content = document.getElementById('adminModalContent');
            const title = document.getElementById('adminModalTitle');
            
            content.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-4xl text-emerald-500 mb-3"></i><p>Memuat Data...</p></div>';
            
            const token = localStorage.getItem('token');
            
            try {
                let url = '';
                let columns = [];
                let rowRenderer = null;
                let actionHTML = '';

                if (type === 'Infaq') {
                    title.innerText = 'Kelola Infaq';
                    url = 'https://baitul-smartflow-api-1777252841.fly.dev/api/kas';
                    actionHTML = `
                        <div class="flex gap-3 mb-4">
                            <button onclick="tambahInfaq('pemasukan')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"><i class="fa-solid fa-plus mr-1"></i> Tambah Infaq (Masuk)</button>
                            <button onclick="tambahInfaq('pengeluaran')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"><i class="fa-solid fa-minus mr-1"></i> Catat Pengeluaran</button>
                        </div>
                    `;
                    columns = ['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal'];
                    rowRenderer = (item) => `<tr>
                        <td class="p-3 border-b">${item.tanggal}</td>
                        <td class="p-3 border-b font-bold ${item.jenis === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}">${item.jenis}</td>
                        <td class="p-3 border-b">${item.sumber_kategori || '-'}</td>
                        <td class="p-3 border-b">${item.keterangan || '-'}</td>
                        <td class="p-3 border-b">Rp ${item.nominal.toLocaleString('id-ID')}</td>
                    </tr>`;
                } else if (type === 'zakat') {
                    title.innerText = 'Data Zakat';
                    url = 'https://baitul-smartflow-api-1777252841.fly.dev/api/zakat';
                    columns = ['Tanggal', 'Muzakki', 'Jenis Zakat', 'Nominal', 'Status'];
                    rowRenderer = (item) => `<tr>
                        <td class="p-3 border-b">${item.tanggal}</td>
                        <td class="p-3 border-b font-bold">${item.nama_muzakki}</td>
                        <td class="p-3 border-b">${item.jenis_zakat}</td>
                        <td class="p-3 border-b">Rp ${item.nominal.toLocaleString('id-ID')}</td>
                        <td class="p-3 border-b"><span class="px-2 py-1 text-xs rounded-full ${item.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${item.status}</span></td>
                    </tr>`;
                } else if (type === 'inventory') {
                    title.innerText = 'Master Inventaris';
                    url = 'https://baitul-smartflow-api-1777252841.fly.dev/api/inventory';
                    columns = ['Nama Aset', 'Jumlah', 'Kondisi', 'Terdaftar'];
                    rowRenderer = (item) => `<tr>
                        <td class="p-3 border-b font-bold">${item.nama_aset}</td>
                        <td class="p-3 border-b">${item.jumlah}</td>
                        <td class="p-3 border-b">${item.kondisi}</td>
                        <td class="p-3 border-b">${new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                    </tr>`;
                } else if (type === 'qurban') {
                    title.innerText = 'Rekap Qurban';
                    url = 'https://baitul-smartflow-api-1777252841.fly.dev/api/qurban-stok';
                    columns = ['Jenis Hewan', 'Harga (Rp)', 'Stok Tersedia', 'Status'];
                    rowRenderer = (item) => `<tr>
                        <td class="p-3 border-b font-bold">${item.jenis_hewan}</td>
                        <td class="p-3 border-b">Rp ${item.harga.toLocaleString('id-ID')}</td>
                        <td class="p-3 border-b">${item.stok} Ekor</td>
                        <td class="p-3 border-b">${item.status}</td>
                    </tr>`;
                }

                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.ok) {
                    const res = await response.json();
                    if(res.data && res.data.length > 0) {
                        let tableHTML = `<div class="overflow-x-auto"><table class="w-full text-left text-sm whitespace-nowrap"><thead class="uppercase tracking-wider border-b-2 text-gray-600 bg-gray-50"><tr>`;
                        columns.forEach(col => { tableHTML += `<th class="p-3">${col}</th>` });
                        tableHTML += `</tr></thead><tbody>`;
                        res.data.forEach(item => { tableHTML += rowRenderer(item) });
                        tableHTML += `</tbody></table></div>`;
                        content.innerHTML = tableHTML;
                    } else {
                        content.innerHTML = '<div class="text-center py-10 text-gray-500"><i class="fa-solid fa-folder-open text-4xl mb-3 block"></i> Belum ada data.</div>';
                    }
                } else {
                    throw new Error("Gagal mengambil data");
                }
            } catch (err) {
                content.innerHTML = `<div class="text-center py-10 text-red-500"><i class="fa-solid fa-circle-exclamation text-4xl mb-3 block"></i> Gagal memuat data dari API.</div>`;
            }
        }

        function closeAdminModal() {
            document.getElementById('adminDataModal').classList.add('hidden');
        }

        // --- Kelola Infaq Admin ---
        function tambahInfaq(jenis) {
            const isPemasukan = jenis === 'pemasukan';
            const endpoint = isPemasukan ? '/api/kas' : '/api/pengeluaran';
            const title = isPemasukan ? 'Tambah Pemasukan (Infaq)' : 'Catat Pengeluaran';
            const defaultKategori = isPemasukan ? 'Infaq Masjid' : 'Operasional';

            Swal.fire({
                title: title,
                html: `
                    <div class="text-left">
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                            <input id="swal-Infaq-nominal" type="number" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Contoh: 150000" min="1000">
                        </div>
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sumber / Kategori</label>
                            <input id="swal-Infaq-kategori" type="text" class="w-full border border-gray-300 rounded px-3 py-2" value="${defaultKategori}">
                        </div>
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                            <input id="swal-Infaq-keterangan" type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Contoh: Dari hamba allah / Beli Token Listrik">
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonColor: isPemasukan ? '#059669' : '#dc2626',
                confirmButtonText: 'Simpan Data',
                cancelButtonText: 'Batal',
                preConfirm: () => {
                    const nominal = document.getElementById('swal-Infaq-nominal').value;
                    const kategori = document.getElementById('swal-Infaq-kategori').value;
                    const keterangan = document.getElementById('swal-Infaq-keterangan').value;
                    
                    if (!nominal || !kategori) {
                        Swal.showValidationMessage('Nominal dan Kategori wajib diisi!');
                        return false;
                    }
                    return { nominal: parseInt(nominal), sumber_kategori: kategori, keterangan: keterangan };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const token = localStorage.getItem('token');
                    Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => { Swal.showLoading() } });
                    try {
                        const response = await fetch('https://baitul-smartflow-api-1777252841.fly.dev' + endpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify(result.value)
                        });
                        if (response.ok) {
                            Swal.fire('Berhasil!', 'Data Infaq berhasil dicatat.', 'success').then(() => {
                                // Refresh modal Infaq
                                openAdminDataModal('Infaq');
                            });
                        } else {
                            const resData = await response.json();
                            Swal.fire('Gagal', resData.message || 'Gagal menyimpan data.', 'error');
                        }
                    } catch (e) {
                        Swal.fire('Kesalahan', 'Terjadi kesalahan jaringan.', 'error');
                    }
                }
            });
        }

        // --- Zakat Functions ---
        function openZakatModal() {
            document.getElementById('zakatModal').classList.remove('hidden');
        }

        function closeZakatModal() {
            document.getElementById('zakatModal').classList.add('hidden');
            document.getElementById('zakatForm').reset();
        }

        async function submitZakat(e) {
            e.preventDefault();
            
            const btn = document.getElementById('btnSubmitZakat');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

            try {
                const formData = new FormData();
                formData.append('nama_muzakki', document.getElementById('namaMuzakki').value);
                formData.append('jenis_zakat', document.getElementById('jenisZakat').value);
                formData.append('nominal', document.getElementById('nominalZakat').value);
                
                const fileInput = document.getElementById('buktiTransfer');
                if (fileInput && fileInput.files.length > 0) {
                    formData.append('image', fileInput.files[0]);
                }

                const token = localStorage.getItem('token');
                const response = await fetch('https://baitul-smartflow-api-1777252841.fly.dev/api/zakat', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData // multipart/form-data
                });

                const textData = await response.text();
                let data = {};
                try {
                    data = JSON.parse(textData);
                } catch(e) {
                    console.error("API response is not JSON:", textData);
                    throw new Error("Server response invalid");
                }

                if (response.ok) {
                    Swal.fire('Alhamdulillah', 'Pembayaran Zakat berhasil dikirim dan menunggu verifikasi Admin.', 'success').then(() => {
                        closeZakatModal();
                        // Refresh data dashboard jika diperlukan
                        fetchMemberDashboardData(token);
                    });
                } else {
                    Swal.fire('Gagal', data.message || 'Gagal mengirim zakat.', 'error');
                }
            } catch (error) {
                console.error("Submit error:", error);
                Swal.fire('Kesalahan', 'Gagal memproses pengiriman zakat. Periksa koneksi Anda.', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Zakat';
            }
        }
    
