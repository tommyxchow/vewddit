import {
  sortOptions,
  timeOptions,
  type SortOption,
  type TimeOption,
} from '@/types/reddit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  subreddit: z.string(),
});

export default function SearchBar() {
  const router = useRouter();

  const currentSubreddit = router.query.slug?.[0] ?? 'earthporn';
  const currentSort = (router.query.slug?.[1] as SortOption) ?? 'hot';
  const currentTime = (router.query.t as TimeOption) ?? 'day';

  const [sort, setSort] = useState<SortOption>(currentSort);
  const [time, setTime] = useState<TimeOption>(currentTime);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (sort === 'top') {
      await router.push(
        `/r/${values.subreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      await router.push(`/r/${values.subreddit}`);
    }
  }

  async function onSortChange(sort: SortOption) {
    setSort(sort);
    if (sort === 'top') {
      await router.push(
        `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
      );
    } else {
      await router.push(`/r/${currentSubreddit}/${sort.toLowerCase()}`);
    }
  }

  async function onTimeChange(time: TimeOption) {
    setTime(time);
    await router.push(
      `/r/${currentSubreddit}/${sort.toLowerCase()}?t=${time.toLowerCase()}`,
    );
  }

  return (
    <div className='flex flex-col gap-2 p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center gap-2'
        >
          <div className='grow'>
            <FormField
              control={form.control}
              name='subreddit'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='bg-black'
                      aria-label='Subreddit name'
                      placeholder='enter a subreddit name'
                      type='search'
                      required
                      aria-describedby={undefined}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button className='w-24' type='submit'>
            submit
          </Button>
        </form>
      </Form>

      <div className='flex items-center justify-between gap-2'>
        <h2 className='truncate text-xl font-semibold sm:text-3xl'>
          <a
            className='hover:underline'
            target='_blank'
            href={`https://www.reddit.com/r/${currentSubreddit}`}
          >
            r/{currentSubreddit}
          </a>{' '}
        </h2>

        <div className='flex gap-2'>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger
              className='w-24 bg-black'
              defaultValue='hot'
              aria-label='Sort'
            >
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {sort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {sort === 'top' && (
            <Select value={time} onValueChange={onTimeChange}>
              <SelectTrigger className='w-24 bg-black' aria-label='Time'>
                <SelectValue placeholder='Time' />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
