import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Box, ShoppingCart, ArrowRight, CheckCircle2, ChevronDown, Activity, DollarSign, Award, Bell, Package, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function LandingPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [salesCount, setSalesCount] = useState(null);

  // Tujuan CTA berdasarkan sesi & role
  const isLoggedIn = !authLoading && user && profile;
  const dashboardPath = profile?.role === 'Admin' ? '/dashboard' : '/member/catalog';
  const primaryCtaTo = isLoggedIn ? dashboardPath : '/register';
  const primaryCtaLabel = isLoggedIn ? 'Masuk ke Dashboard Anda' : 'Mulai Gratis Sekarang';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .order('created_at', { ascending: false })
          .limit(8);
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Gagal memuat produk:', err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    // Live Sales Counter: total transaksi sukses via RPC aman (Social Proof)
    // Pengunjung anonim memanggil fungsi ini tanpa akses langsung ke tabel orders.
    const fetchSalesCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_total_success_orders');
        if (error) throw error;
        setSalesCount(Number(data) ?? 0);
      } catch (err) {
        console.error('Gagal memuat jumlah transaksi:', err.message);
      }
    };

    fetchProducts();
    fetchSalesCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-barlow flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-2.5 text-white shadow-md shadow-emerald-200">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-poppins text-2xl font-bold tracking-tight text-slate-900">
              Apotek<span className="text-emerald-500">Sehat</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#produk" className="hover:text-emerald-500 transition-colors">Produk</a>
            <a href="#fitur" className="hover:text-emerald-500 transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-emerald-500 transition-colors">Harga</a>
            <a href="#faq" className="hover:text-emerald-500 transition-colors">FAQ</a>
          </nav>

          {/* CTA Secondary */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 hover:text-emerald-500 transition-colors px-4 py-2"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 hover:shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* LIVE SALES COUNTER (Social Proof) */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          {salesCount === null ? (
            <span className="text-slate-300">Memuat data transaksi...</span>
          ) : (
            <span>
              <span className="font-bold text-emerald-400">{salesCount.toLocaleString('id-ID')}</span>
              {' '}transaksi berhasil diselesaikan dan terus bertambah
            </span>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white to-slate-50">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Pre-title */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 tracking-wider uppercase mb-6 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Apotek Online Terpercaya
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-poppins font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight md:leading-none mb-6">
Obat & Kebutuhan Kesehatan Terlengkap, Diantar dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Hitungan Jam</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
Pesan obat, vitamin, dan alat kesehatan dengan mudah. Stok selalu tersedia, harga transparan, dan tebus resep online tanpa perlu antre di apotek.
          </p>

          {/* CTA Primary - Conditional berdasarkan sesi pengguna */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={primaryCtaTo}
              className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {primaryCtaLabel}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#fitur"
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              Pelajari Fitur
            </a>
          </div>

          {/* Mockup Dashboard Statis */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl shadow-slate-200/50">
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner flex flex-col">
              {/* Mockup Window Header */}
              <div className="bg-slate-900/60 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-slate-800/80 px-10 py-1 rounded text-[11px] text-slate-400 font-mono select-none">
                  apoteksehat.app/dashboard
                </div>
                <div className="w-12" />
              </div>
              
              {/* Mockup Content */}
              <div className="bg-slate-950 p-6 text-left grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
                {/* Mockup Sidebar */}
                <div className="hidden md:flex flex-col gap-4 border-r border-slate-800/60 pr-4">
                  <div className="h-6 w-24 bg-slate-800 rounded" />
                  <div className="space-y-2 mt-4">
                    <div className="h-8 bg-emerald-500/10 border-l-2 border-emerald-500 rounded px-2 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <div className="h-3 w-16 bg-slate-400/80 rounded" />
                    </div>
                    <div className="h-8 rounded px-2 flex items-center gap-2 hover:bg-slate-900">
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                      <div className="h-3 w-16 bg-slate-600 rounded" />
                    </div>
                    <div className="h-8 rounded px-2 flex items-center gap-2 hover:bg-slate-900">
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                      <div className="h-3 w-12 bg-slate-600 rounded" />
                    </div>
                  </div>
                </div>

                {/* Mockup Main View */}
                <div className="md:col-span-3 flex flex-col gap-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Penjualan Obat</p>
                        <p className="text-lg font-bold text-white mt-1">Rp 120.4M</p>
                      </div>
                      <DollarSign className="text-emerald-500 h-5 w-5" />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Pelanggan</p>
                        <p className="text-lg font-bold text-white mt-1">842</p>
                      </div>
                      <Users className="text-blue-400 h-5 w-5" />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Level Loyalitas</p>
                        <p className="text-lg font-bold text-white mt-1">Gold</p>
                      </div>
                      <Award className="text-amber-400 h-5 w-5" />
                    </div>
                  </div>

                  {/* Chart and Activity */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-32 bg-slate-700 rounded" />
                      <div className="h-3.5 w-12 bg-slate-800 rounded" />
                    </div>
                    <div className="h-28 flex items-end gap-3 pt-4 border-b border-slate-850">
                      <div className="flex-1 bg-slate-800 h-1/3 rounded-t" />
                      <div className="flex-1 bg-emerald-500 h-2/3 rounded-t" />
                      <div className="flex-1 bg-slate-800 h-1/2 rounded-t" />
                      <div className="flex-1 bg-emerald-500 h-4/5 rounded-t" />
                      <div className="flex-1 bg-emerald-500 h-full rounded-t" />
                      <div className="flex-1 bg-slate-800 h-3/4 rounded-t" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PRODUCT SHOWCASE (Interest & Desire) */}
      <section id="produk" className="py-20 md:py-28 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Katalog Live</span>
            <h2 className="text-3xl md:text-4xl font-poppins font-black text-slate-900 tracking-tight mt-2 mb-4">
              Produk Tersedia Hari Ini
            </h2>
            <p className="text-slate-500">
              Stok dan harga di bawah ini diambil langsung dari sistem apotek kami secara real-time.
            </p>
          </div>

          {loadingProducts ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              Belum ada produk yang tersedia saat ini.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="justify-between transition-all hover:ring-emerald-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-2">
                      <Package className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-poppins">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description || 'Produk kesehatan terpercaya.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <span className="text-emerald-600 font-bold text-lg">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Stok: {product.stock}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/login" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      Beli Sekarang <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURE SECTION (Interest) */}
      <section id="fitur" className="py-20 md:py-28 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Keunggulan Utama</span>
            <h2 className="text-3xl md:text-4xl font-poppins font-black text-slate-900 tracking-tight mt-2 mb-4">
              Layanan Apotek yang Lengkap & Terpercaya
            </h2>
            <p className="text-slate-500">
              Dari obat resep sampai kebutuhan harian, semua tersedia dengan jaminan keaslian dan layanan farmasi yang ramah.
            </p>
          </div>

          {/* Grid 3 Kolom */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-poppins font-bold text-xl text-slate-950 mb-3">Tebus Resep Online</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Unggah resep dokter Anda dan biarkan apoteker kami menyiapkan obatnya. Praktis, aman, dan tanpa perlu antre di loket apotek.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Box className="h-6 w-6" />
              </div>
              <h3 className="font-poppins font-bold text-xl text-slate-950 mb-3">Obat & Vitamin Lengkap</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Ribuan produk obat bebas, vitamin, suplemen, dan alat kesehatan dengan stok real-time serta jaminan keaslian dari distributor resmi.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="font-poppins font-bold text-xl text-slate-950 mb-3">Pengantaran Cepat</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Pesanan Anda diantar langsung ke rumah dalam hitungan jam. Lacak status pesanan secara transparan dari penyiapan hingga tiba.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION (Harga - Pendukung AIDA) */}
      <section id="harga" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Keanggotaan</span>
            <h2 className="text-3xl md:text-4xl font-poppins font-black text-slate-900 tracking-tight mt-2 mb-4">
              Gabung Member, Nikmati Banyak Keuntungan
            </h2>
            <p className="text-slate-500">
              Daftar gratis dan kumpulkan poin di setiap pembelian untuk mendapatkan diskon obat dan vitamin.
            </p>
          </div>

          <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-100 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Paling Populer
            </span>
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Member Apotek</p>
              <div className="flex items-baseline justify-center gap-1 mt-4">
                <span className="text-5xl font-black text-slate-950">Rp 0</span>
                <span className="text-slate-400 font-semibold text-sm">/selamanya</span>
              </div>
            </div>
            <ul className="space-y-3.5 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Tebus Resep Obat Online</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Katalog Obat & Vitamin Real-time</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Poin & Diskon Tier Member</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Pengantaran ke Rumah</span>
              </li>
            </ul>
            <Link
              to="/register"
              className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-100"
            >
              Coba Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (FAQ - Pendukung Kredibilitas) */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Bantuan</span>
            <h2 className="text-3xl md:text-4xl font-poppins font-black text-slate-900 tracking-tight mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="poin-tier" className="bg-slate-50 px-6 rounded-xl border border-slate-100">
              <AccordionTrigger className="font-poppins font-bold text-slate-950 hover:no-underline">
                Bagaimana sistem poin dan tier member bekerja?
              </AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm leading-relaxed">
                Setiap transaksi sukses akan memberikan poin yang otomatis menaikkan tier Anda (Bronze, Silver, Gold) untuk diskon eksklusif.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="obat-asli" className="bg-slate-50 px-6 rounded-xl border border-slate-100">
              <AccordionTrigger className="font-poppins font-bold text-slate-950 hover:no-underline">
                Apakah semua obat di sini dijamin asli?
              </AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm leading-relaxed">
                Ya. Seluruh obat dan produk kesehatan kami peroleh langsung dari distributor resmi dan disimpan sesuai standar penyimpanan farmasi untuk menjaga keaslian dan kualitasnya.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tebus-resep" className="bg-slate-50 px-6 rounded-xl border border-slate-100">
              <AccordionTrigger className="font-poppins font-bold text-slate-950 hover:no-underline">
                Bagaimana cara menebus resep dokter secara online?
              </AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm leading-relaxed">
                Cukup unggah foto resep dokter Anda saat checkout. Apoteker kami akan memverifikasi dan menyiapkan obatnya sebelum diantar ke alamat Anda.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA & FOOTER (Action) */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          {/* Upper footer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 rounded-lg p-2 text-white">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="font-poppins text-xl font-bold tracking-tight text-white">
                  ApotekSehat
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Apotek online terpercaya untuk kebutuhan obat dan kesehatan keluarga Anda.
              </p>
            </div>

            {/* Nav Group 1 */}
            <div>
              <h5 className="text-white font-bold text-sm mb-4">Navigasi</h5>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur Utama</a></li>
                <li><a href="#harga" className="hover:text-white transition-colors">Skema Harga</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</a></li>
              </ul>
            </div>

            {/* Nav Group 2 */}
            <div>
              <h5 className="text-white font-bold text-sm mb-4">Akses Aplikasi</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Masuk Dasbor</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Pendaftaran Member Baru</Link></li>
              </ul>
            </div>

            {/* Credibility Anchor / Address */}
            <div className="text-sm flex flex-col gap-2">
              <h5 className="text-white font-bold text-sm mb-2">Kantor Resmi</h5>
              <p className="text-slate-500 leading-relaxed">
                ApotekSehat Pusat<br />
                Gedung Farma Sentra, Lt. 3<br />
                Jl. HR Rasuna Said Kav C-22, Jakarta Selatan, 12940
              </p>
            </div>
          </div>

          {/* Lower footer */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <span>&copy; {new Date().getFullYear()} ApotekSehat. Seluruh hak cipta dilindungi undang-undang.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300">Ketentuan Layanan</a>
              <a href="#" className="hover:text-slate-300">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
