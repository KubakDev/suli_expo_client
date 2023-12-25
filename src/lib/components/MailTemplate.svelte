<script lang="ts">
	import moment from 'moment';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import type { CompanyModel } from '../../routes/company-registration/models/company';
	import type { ReserveSeatModel } from '../../models/reserveSeat';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { locale, LL } from '$lib/i18n/i18n-svelte';
	import { onMount } from 'svelte';

	export let exhibition: ExhibitionModel;
	export let companyData: CompanyModel;
	export let reserveSeatData: ReserveSeatModel;
	onMount(() => {
		console.log($locale);
	});
</script>

<div style={$locale == 'ar' || $locale == 'ckb' ? 'direction: rtl' : ''}>
	<p>
		{$LL.email_template.dear()}
		<span style="color:#e1b168;font-weight: bold;">{companyData?.company_name?.toUpperCase()}</span>
	</p>

	<p>
		{$LL.email_template.thanks()}
	</p>

	<p>{$LL.email_template.detail.title()}</p>
	<ul>
		<li>
			<span style="font-weight: bold;">{$LL.email_template.detail.date_time()} </span>
			{moment(new Date()).format('DD-MM-YYYY  HH:SS:MM')}
		</li>
		<li>
			<span style="font-weight: bold;">{$LL.email_template.detail.event()}</span>
			{exhibition?.exhibition_type}
		</li>
		<li>
			<span style="font-weight: bold;">{$LL.email_template.detail.note()} </span>
		</li>
	</ul>

	<p>
		{$LL.email_template.pending()}
	</p>

	<p>
		{$LL.email_template.help.header()}
		<span style="color:#e1b168; font-weight:bold">
			{$contactInfoSectionStore[0]?.email}
		</span>
		,
		<span style="color:#e1b168; font-weight:bold">
			{$contactInfoSectionStore[0]?.phoneNumber_marketing}
		</span>
		{$LL.email_template.help.footer()}
	</p>

	<p>
		{$LL.email_template.thanks_waiting()}
	</p>

	<p>{$LL.email_template.regards()}</p>
	<p>{$LL.email_template.signature()}</p>
	{#if $contactInfoSectionStore}
		{#each $contactInfoSectionStore as info}
			<div>
				<li>
					<span style="color:#e1b168; font-weight:bold">
						{$LL.email_template.contact.marketing()}
					</span>
					{info.phoneNumber_marketing}
				</li>
				<li>
					<span style="color:#e1b168; font-weight:bold"
						>{$LL.email_template.contact.relations()}
					</span>
					{info.phoneNumber_relations}
				</li>
				<li>
					<span style="color:#e1b168; font-weight:bold"
						>{$LL.email_template.contact.technical()}
					</span>
					{info.phoneNumber_Technical}
				</li>
				<li>
					<span style="color:#e1b168; font-weight:bold"
						>{$LL.email_template.contact.administration()}</span
					>
					{info.phoneNumber_Administration}
				</li>
			</div>
		{/each}
	{/if}
	<p>
		{$LL.email_template.contact.website()}
		<a href={import.meta.env.VITE_BASE_URL}>{import.meta.env.VITE_BASE_URL}</a>
	</p>
	<br />
	<p>
		{$LL.email_template.contact.warningMessage()}
	</p>
	<p>{$LL.email_template.contact.regard()}</p>
	<p>{$LL.email_template.contact.team()}</p>
</div>
