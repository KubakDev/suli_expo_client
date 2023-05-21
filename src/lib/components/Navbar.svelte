<script>
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Chevron,
		DropdownDivider,
		Button,
		Toggle,
		DarkMode
	} from 'flowbite-svelte';

	let themeMode = 'light';

	function onThemeModeChange() {
		themeMode;
	}
</script>

<Navbar
	navDivClass="  mx-auto flex flex-wrap justify-center items-center  max-w-full "
	navClass="px-2 sm:px-4 py-2.5  w-full z-20 top-0 left-0 border-b max-w-full relative"
	let:hidden
	let:toggle
>
	<NavHamburger on:click={toggle} />
	<NavUl
		divClass="w-full md:block md:w-auto jutify-center max-w-full items-center"
		ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium items-center"
		{hidden}
	>
		<NavLi class="mx-2 cursor-pointer" href="/" active={true}>Home</NavLi>
		<NavLi class="mx-2 cursor-pointer" href="/news" active={true}>News</NavLi>
		<NavLi class="mx-2 cursor-pointer" href="/exhibition">Exhibition</NavLi>
		<NavLi class="mx-2 cursor-pointer" href="/pricing">Pricing</NavLi>
		<NavLi class="mx-2 cursor-pointer" href="/contact">Contact</NavLi>
		<div class="flex justify-center items-center mx-4">
			<NavLi class="mx-2" href="/services">Services</NavLi>
			<NavLi class="mx-2" href="/pricing">Pricing</NavLi>
			<NavLi class="mx-2" href="/contact">Contact</NavLi>
			<Button class="mx-4" color="primary"><Chevron>Lang</Chevron></Button>

			<Dropdown>
				<DropdownItem>Kurdish</DropdownItem>
				<DropdownItem>Arabic</DropdownItem>
				<DropdownItem>English</DropdownItem>
			</Dropdown>
		</div>
		<div class="flex-1 block" />
		<DarkMode class="absolute right-10" />
	</NavUl>
</Navbar>
