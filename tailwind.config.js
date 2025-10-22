/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		screens: {
			'mobile-menu': '815px',
			'tablet': '830px',
			'semi-lg': '920px',
			'semi-lg2': '970px',
			'semi-xl': '1376px',
		},
		fontFamily: {
			onest: ['Onest Variable', 'Onest', 'system-ui', 'sans-serif'],
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		colors: {
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			card: {
				DEFAULT: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			popover: {
				DEFAULT: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			primary: {
				DEFAULT: 'var(--primary)',
				foreground: 'var(--primary-foreground)'
			},
			secondary: {
				DEFAULT: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			muted: {
				DEFAULT: 'var(--background)',
				foreground: 'var(--muted-foreground)'
			},
			accent: {
				DEFAULT: 'var(--accent)',
				foreground: 'var(--primary-foreground)'
			},
			destructive: {
				DEFAULT: 'var(--destructive)',
				foreground: 'var(--primary-foreground)'
			},
			border: 'var(--border)',
			input: 'var(--input)',
			ring: 'var(--ring)',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			table: {
				hover: '#F7F8FF',
				selected: '#DBDEFF'
			},
		},
  		keyframes: {
  			"caret-blink": {
  				"0%,70%,100%": { opacity: "1" },
  				"20%,50%": { opacity: "0" },
  			},
  		},
  		animation: {
  			"caret-blink": "caret-blink 1.25s ease-out infinite",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

