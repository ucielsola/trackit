<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAuthService } from '$lib/services/authService';

	let email = '';
	let otp = '';
	let otpSent = false;
	let loading = false;
	let error: string | null = null;

	const auth = getAuthService();

	const sendOtp = async () => {
		loading = true;
		error = await auth.sendOtp(email);
		otpSent = !error;
		loading = false;
	};

	const verifyOtp = async () => {
		loading = true;
		error = await auth.verifyOtp(email, otp);
		if (!error) goto('/private');
		loading = false;
	};
</script>

<div class="w-fit rounded-xl border p-4">
	<h1 class="mb-6 text-xl font-bold">Sign in with email</h1>

	{#if !otpSent}
		<div class="form-control mb-4">
			<label class="label" for="email-input">
				<span class="label-text">Email</span>
			</label>
			<input
				id="email-input"
				type="email"
				class="input-bordered input"
				placeholder="you@example.com"
				bind:value={email}
				onkeydown={(e) => e.key === 'Enter' && sendOtp()}
			/>
		</div>
		<button class="btn w-full btn-primary" onclick={sendOtp} disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner"></span>
			{/if}
			{loading ? 'Sending...' : 'Send OTP'}
		</button>
	{:else}
		<p class="mb-4 text-sm text-green-600">OTP sent to {email}. Check your inbox.</p>
		<div class="form-control mb-4">
			<label class="label" for="otp-input">
				<span class="label-text">Enter OTP</span>
			</label>
			<input
				id="otp-input"
				type="text"
				class="input-bordered input"
				placeholder="6-digit code"
				maxlength="6"
				bind:value={otp}
				onkeydown={(e) => e.key === 'Enter' && verifyOtp()}
			/>
		</div>
		<button class="btn w-full btn-success" onclick={verifyOtp} disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner"></span>
			{/if}
			{loading ? 'Verifying...' : 'Verify OTP'}
		</button>
	{/if}

	{#if error}
		<p class="mt-4 text-sm text-red-600">{error}</p>
	{/if}
</div>
