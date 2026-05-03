export default function PageHeader({ title, breadcrumb, children }) {
    return (
        <div id="pageheader-container" className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 p-8 shadow-lg">
            <div className="flex items-center justify-between">
                <div id="pageheader-left" className="flex flex-col">
                    <h1 id="page-title" className="text-4xl font-bold text-white mb-3">
                        {title}
                    </h1>
                    <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 text-sm">
                        <span className="text-amber-100 opacity-80">Dashboard</span>
                        <span className="text-amber-200 opacity-60">/</span>
                        <span className="text-amber-50 font-semibold">
                            {Array.isArray(breadcrumb) ? breadcrumb.join(" / ") : breadcrumb}
                        </span>
                    </div>
                </div>
                
                {/* Slot untuk tombol "Add Orders" atau "Add Customer" */}
                <div id="pageheader-actions" className="flex items-center gap-3">
                    {children}
                </div>
            </div>
        </div>
    );
}