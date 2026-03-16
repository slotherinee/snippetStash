<template>
  <div class="max-w-2xl mx-auto">

    <!-- ── EDIT ───────────────────────────────────────────────── -->
    <form v-show="activeTab === 'Edit'" @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="label">{{ t('create.titleLabel') }} <span class="text-red-400">*</span></label>
        <input v-model="form.title" type="text" class="input" :placeholder="t('create.titlePlaceholder')" required />
      </div>

      <div>
        <label class="label">{{ t('create.descriptionLabel') }} <span class="text-red-400">*</span></label>
        <textarea v-model="form.description" class="input resize-none" rows="3" :placeholder="t('create.descriptionPlaceholder')" required />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="label">{{ t('create.languageLabel') }}</label>
          <select v-model="form.language" class="input cursor-pointer">
            <option value="">{{ t('create.selectLanguage') }}</option>
            <option v-for="lang in LANGUAGES" :key="lang" :value="lang">{{ lang }}</option>
          </select>
        </div>
        <div>
          <label class="label">
            {{ t('create.tagsLabel') }}
            <span class="text-xs font-normal ml-1" style="color: var(--text-muted)">{{ t('create.tagsHint') }}</span>
          </label>
          <input v-model="tagsInput" type="text" class="input" :placeholder="t('create.tagsPlaceholder')" />
        </div>
      </div>

      <div>
        <label class="label">
          {{ t('create.codeLabel') }} <span class="text-red-400">*</span>
          <span class="text-xs ml-2 font-normal" style="color: var(--text-muted)">{{ t('create.codeHint') }}</span>
        </label>
        <textarea
          v-model="form.code"
          class="input font-mono resize-none"
          style="font-size: 0.8em"
          rows="16"
          :placeholder="t('create.codePlaceholder')"
          required
        />
      </div>

      <div v-if="error" class="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        {{ error }}
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
        <NuxtLink to="/posts" class="btn-ghost border border-surface-border text-center">{{ t('create.cancel') }}</NuxtLink>
        <div class="flex flex-col sm:flex-row gap-2">
          <button type="button" @click="activeTab = 'Preview'" class="btn-ghost border border-surface-border text-center">
            {{ t('create.preview') }}
          </button>
          <button type="submit" :disabled="loading" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">{{ t('create.publishing') }}</span>
            <span v-else>{{ t('create.publish') }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- ── PREVIEW ────────────────────────────────────────────── -->
    <div v-show="activeTab === 'Preview'" class="space-y-5">

      <!-- Post header preview -->
      <div class="rounded-xl p-4 sm:p-5" style="background: var(--surface-card); border: 1px solid var(--color-border)">
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span
            v-if="form.language"
            class="text-xs font-mono px-2 py-0.5 rounded-full border"
            style="border-color: var(--color-border); color: var(--text-muted)"
          >{{ form.language }}</span>
          <span
            v-for="tag in parsedTags"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
          >#{{ tag }}</span>
        </div>

        <h1
          class="text-xl sm:text-2xl font-bold leading-tight mb-2"
          :style="form.title ? 'color: var(--text-primary)' : 'color: var(--text-muted)'"
        >{{ form.title || t('create.untitled') }}</h1>

        <p
          class="text-sm leading-relaxed"
          :style="form.description ? 'color: var(--text-secondary)' : 'color: var(--text-muted)'"
        >{{ form.description || t('create.noDescription') }}</p>
      </div>

      <!-- Code / Live preview tabs -->
      <div>
        <div class="grid grid-cols-2 sm:flex gap-1 mb-3">
          <button
            @click="codeTab = 'preview'"
            class="px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border"
            :class="codeTab === 'preview' ? 'bg-accent-green/10 border-accent-green/40 text-accent-green' : 'border-surface-border hover:bg-surface-hover'"
            :style="codeTab !== 'preview' ? 'color: var(--text-secondary)' : ''"
          >{{ t('create.livePreview') }}</button>
          <button
            @click="codeTab = 'code'"
            class="px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border"
            :class="codeTab === 'code' ? 'bg-accent/10 border-accent/40 text-accent' : 'border-surface-border hover:bg-surface-hover'"
            :style="codeTab !== 'code' ? 'color: var(--text-secondary)' : ''"
          >⟨/⟩ Code</button>
        </div>

        <div v-if="!form.code" class="rounded-xl p-8 text-center text-sm" style="color: var(--text-muted); background: var(--surface-card); border: 1px solid var(--color-border)">
          {{ t('create.noCode') }}
        </div>
        <template v-else>
          <CodePreview v-if="codeTab === 'preview'" :code="form.code" />
          <CodeBlock   v-else :code="form.code" :lang="langKey" />
        </template>
      </div>

      <!-- Back to edit / Publish -->
      <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <button @click="activeTab = 'Edit'" class="btn-ghost border border-surface-border text-center">
          {{ t('create.backToEdit') }}
        </button>
        <button @click="submit" :disabled="loading" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading">{{ t('create.publishing') }}</span>
          <span v-else>{{ t('create.publish') }}</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '~/types'

definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Create — SnippetStash' })

const { t } = useI18n()
const { user } = useAuth()
const { success: toastSuccess } = useToast()
const router = useRouter()

const activeTab = ref<'Edit' | 'Preview'>('Edit')
const codeTab   = ref<'preview' | 'code'>('preview')

const form = reactive({ title: '', description: '', code: '', language: '' })
const tagsInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const parsedTags = computed(() =>
  tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
)

const langKey = computed(() => form.language?.toLowerCase() || undefined)

async function submit() {
  if (!user.value) return
  loading.value = true
  error.value = null
  try {
    const { createPost } = await import('~/services/api')
    const tags = parsedTags.value
    const post = await createPost({
      title:       form.title,
      description: form.description,
      code:        form.code,
      language:    form.language || undefined,
      tags:        tags.length ? tags : undefined,
      author_id:   user.value.id,
      createdAt:   new Date().toISOString(),
      likes:       [],
      views:       0,
    })
    toastSuccess(t('create.success'))
    router.push(`/posts/${post.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
