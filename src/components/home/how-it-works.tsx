export default function PizzaSections() {
  return (
    <main className="text-foreground overflow-hidden">
      {/* POPULAR PIZZA COMBOS HERO */}
      <section
        className="relative bg-background min-h-140 flex items-center
  erflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-150
    bg-[#FF404C]/10 blur-[150px] rounded-full"
        />

        {/* COMBO OFFER SVG - TOP RIGHT */}
        <img
          src="/images/combo-offer.png"
          alt="Limited time combo offer"
          className="absolute top-4 right-4 md:top-8 md:right-50
      w-28 md:w-40 lg:w-48 z-30
      hover:rotate-6 transition duration-300"
        />

        <div
          className="max-w-7xl mx-auto px-6 py-14 grid
    lg:grid-cols-2 gap-10 items-center relative z-10"
        >
          {/* LEFT CONTENT */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-foreground uppercase backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-white/75 sm:text-[11px] mb-6">
              🔥 HOT & TRENDING
            </span>

            <h1
              className="text-5xl md:text-7xl font-black
        leading-[1.05] tracking-tight"
            >
              Popular
              <br />
              <span className="text-[#FF404C] dark:text-[#FFB340]">
                Pizza
              </span>{" "}
              Combos
            </h1>

            <p className="mt-6 text-2xl font-semibold text-foreground">
              More Pizza. More Savings.
            </p>

            <p className="mt-3 text-muted-foreground max-w-lg text-lg leading-relaxed">
              Perfect combos for every pizza lover. Delicious pizza, crispy
              sides and refreshing drinks packed together for the perfect meal.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="bg-primary hover:bg-primary/90
          px-8 py-4 rounded-full font-bold text-foreground
          transition duration-300 hover:scale-105 shadow-lg
          shadow-primary/20"
              >
                Order Your Combo →
              </button>

              <button
                className="border border-slate-900 hover:border-ember
          px-8 py-4 rounded-full font-semibold transition dark:border-slate-500"
              >
                Explore Menu
              </button>
            </div>

            {/* TRUST */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/100?img=${n + 10}`}
                    alt="Customer"
                    className="w-11 h-11 rounded-full border-2
                border-background"
                  />
                ))}
              </div>

              <div>
                <p className="font-bold text-sm">50K+ Happy Customers</p>
                <p className="text-ember text-sm">★★★★★</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE - SHORTER HEIGHT */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 bg-ember/20
        blur-[100px] rounded-full"
            />

            <img
              src="/images/combo-pizza.png"
              alt="Delicious pizza combo"
              className="relative z-10 w-full max-h-[420px]
          object-contain rounded-[30px] drop-shadow-2xl
          hover:scale-[1.02] transition duration-500"
            />
          </div>
        </div>

        {/* BOTTOM DECORATION */}
        {/* <div
          className="absolute bottom-0 left-0 w-full h-2
    bg-linear-to-r from-primary via-ember
    to-primary"
        /> */}
      </section>
    </main>
  );
}
